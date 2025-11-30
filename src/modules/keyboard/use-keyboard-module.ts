import { useIsMobile } from "@/hooks/use-mobile";
import { isValidIndex } from "@/lib/utils";
import type {
	SlimItem,
	SlimElementProps,
	SlimMode,
	SlimElement,
	SlimMapEntry,
} from "@/modules/keyboard/keyboard.schema";
import { useModeContext } from "@/modules/keyboard/mode.context";
import { useRef, useEffect, useCallback } from "react";

export type UseKeyboardModuleReturn = ReturnType<typeof useKeyboardModule>;

export function useKeyboardModule() {
	const isMobile = useIsMobile();
	const { focusIndex: focusIdx, mode, prevMode, dispatch } = useModeContext();
	const focusedRef = useRef<SlimElement | null>(null);
	const map = useRef(new Map<number, SlimMapEntry>());

	const handleSetItems = useCallback(
		(items: SlimItem[]) => {
			requestAnimationFrame(() => {
				map.current.clear();

				for (const [index, subItem] of items.entries()) {
					const element = document.getElementById(subItem.id);
					if (!element) continue;
					map.current.set(index, { item: subItem, element });
				}

				dispatch({ type: "setIndex", payload: 0 });
			});
		},
		[dispatch],
	);

	useEffect(() => {
		const inputs = document.querySelectorAll("input, textarea");

		const decreaseKeys = ["ArrowLeft", "ArrowUp", "Backspace"];
		const increaseKeys = ["ArrowRight", "ArrowDown", "Tab"];
		const navigateKeys = [...decreaseKeys, ...increaseKeys];
		const escapeKeys = ["Escape"];

		const handleEscapeKey = (e: KeyboardEvent) => {
			if (!escapeKeys.includes(e.code)) return;

			if (mode === "action") {
				dispatch({ type: "setMode", payload: prevMode === "action" ? "normal" : prevMode });
			} else if (mode !== "normal") {
				dispatch({ type: "setMode", payload: "normal" });
			}

			dispatch({ type: "resetKeyBuffer" });
			focusedRef.current?.blur();
			focusedRef.current = null;

			map.current.clear();
		};

		const handleKeySequence = (e: KeyboardEvent) => {
			dispatch({ type: "appendKey", payload: e.code });

			if (isValidIndex(parseInt(e.key), map.current)) {
				e.preventDefault();
				dispatch({ type: "setIndex", payload: parseInt(e.key) });
				dispatch({ type: "setMode", payload: "visual" });
			} else if (navigateKeys.includes(e.code)) {
				e.preventDefault();
				dispatch({ type: "setMode", payload: "visual" });
			}
		};

		const handleNavigate = (e: KeyboardEvent) => {
			if (isValidIndex(parseInt(e.key), map.current)) {
				e.preventDefault();
				dispatch({ type: "setIndex", payload: parseInt(e.key) });
			} else if (increaseKeys.includes(e.code)) {
				e.preventDefault();
				dispatch({ type: "increaseIndex", payload: { total: map.current.size } });
			} else if (decreaseKeys.includes(e.code)) {
				e.preventDefault();
				dispatch({ type: "decreaseIndex", payload: { total: map.current.size } });
			} else {
				const entry = map.current.get(focusIdx);

				if (!entry) return;

				const keyPress = e.key === " " ? "Space" : e.key;
				const action = entry.item.actions.find((action) => action.keys.includes(keyPress));

				if (!action) return;

				e.preventDefault();
				console.log(action.fn.toString());
				action.fn();
				if (action.items) {
					dispatch({ type: "setMode", payload: "action" });
					handleSetItems(action.items);
				}
			}
		};

		const handleFocus = (e: Event) => {
			focusedRef.current = e.currentTarget as SlimElement;
			dispatch({ type: "setMode", payload: "insert" });
		};

		const handleBlur = () => {
			dispatch({ type: "setMode", payload: "normal" });
		};

		const handleDialogOpen = (e: CustomEvent) => {
			console.count(`dialog:open ${e.detail.id}`);
			if (mode !== "action") {
				dispatch({ type: "setMode", payload: "action" });
			}
		};

		const handleDialogClose = (e: CustomEvent) => {
			console.count(`dialog:close ${e.detail.id}`);
			dispatch({ type: "setMode", payload: "normal" });
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			switch (mode) {
				case "normal":
					handleKeySequence(e);
					handleEscapeKey(e);
					break;
				case "visual":
					handleKeySequence(e);
					handleEscapeKey(e);
					handleNavigate(e);
					break;
				case "action":
					handleEscapeKey(e);
					handleNavigate(e);
					break;
				case "insert":
					handleEscapeKey(e);
					break;
				default:
					break;
			}
		};

		if (!isMobile) {
			document.addEventListener("keydown", handleKeyDown);
			document.addEventListener("dialog:close", handleDialogClose);
			document.addEventListener("dialog:open", handleDialogOpen);
			inputs.forEach((el) => {
				el.addEventListener("focus", handleFocus);
				el.addEventListener("blur", handleBlur);
			});
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("dialog:close", handleDialogClose);
			document.removeEventListener("dialog:open", handleDialogOpen);
			inputs.forEach((el) => {
				el.removeEventListener("focus", handleFocus);
				el.removeEventListener("blur", handleBlur);
			});
		};
	}, [isMobile, mode, prevMode, focusIdx, dispatch, handleSetItems]);

	const register = (id: string): SlimElementProps => ({ id, tabIndex: -1 });

	const getIsFocused = (id: string): boolean => {
		const focusableModes: SlimMode[] = ["visual", "action"];

		if (!focusableModes.includes(mode)) return false;

		const entry = map.current.get(focusIdx);
		const isFocused = entry !== undefined && entry.item.id === id;

		if (isFocused) {
			entry.element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
		}

		return isFocused;
	};

	const setInitialItems = (initialItems: SlimItem[]) => {
		if (mode !== "action") {
			for (const [index, item] of initialItems.entries()) {
				const has = map.current.get(index);
				const seen = has && has.item.id === item.id;
				const element = document.getElementById(item.id);

				if (seen || !element) continue;

				map.current.set(index, { item, element });
			}
		}
	};
	return {
		register,
		getIsFocused,
		setInitialItems,
	};
}
