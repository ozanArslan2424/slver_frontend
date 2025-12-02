import { useIsMobile } from "@/hooks/use-mobile";
import { isValidIndex } from "@/lib/utils";
import type { SlimItem, SlimElementProps, SlimMode } from "@/modules/keyboard/keyboard.schema";
import { useModeContext } from "@/modules/keyboard/mode.context";
import { useRef, useEffect, useCallback, useState } from "react";

export type UseKeyboardModuleReturn = ReturnType<typeof useKeyboardModule>;

// Simple, fast hash function for arrays
function computeItemsHash(items: SlimItem[]): string {
	// Fastest approach for typical array sizes
	// Creates a simple string signature of all item IDs
	let hash = "";
	for (let i = 0; i < items.length; i++) {
		hash += items[i].id;
		if (i < items.length - 1) hash += "|"; // separator to distinguish "a|b" from "ab"
	}
	return hash;
}

export function useKeyboardModule() {
	const isMobile = useIsMobile();
	const { mode, prevMode, dispatch } = useModeContext();
	const [currentId, setCurrentId] = useState<string | null>(null);
	const hash = useRef<string>("");
	const map = useRef(new Map<string, SlimItem>());

	const handleSetItems = useCallback((items: SlimItem[]) => {
		const currentHash = computeItemsHash(items);
		if (currentHash === hash.current) {
			return;
		}
		hash.current = currentHash;

		requestAnimationFrame(() => {
			map.current.clear();
			console.count("cleared");
			for (const item of items) {
				const element = document.getElementById(item.id);
				if (!element) continue;
				map.current.set(item.id, item);
			}
		});
	}, []);

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
		};

		const handleIndex = (updater: number | ((prevIdx: number) => number)) => {
			const ids = Array.from(map.current.keys());
			const max = ids.length - 1;
			const prevIdx = currentId ? ids.findIndex((id) => id === currentId) : 0;
			const input = typeof updater === "function" ? updater(prevIdx) : updater;
			const nextIdx = input > max ? 0 : input < 0 ? max : input;
			const id = ids[nextIdx];
			setCurrentId(id);
		};

		const handleKeySequence = (e: KeyboardEvent) => {
			dispatch({ type: "appendKey", payload: e.code });

			if (isValidIndex(parseInt(e.key), map.current)) {
				e.preventDefault();
				handleIndex(parseInt(e.key));
				dispatch({ type: "setMode", payload: "visual" });
			} else if (navigateKeys.includes(e.code)) {
				e.preventDefault();
				handleIndex(0);
				dispatch({ type: "setMode", payload: "visual" });
			}
		};

		const handleNavigate = (e: KeyboardEvent) => {
			if (isValidIndex(parseInt(e.key), map.current)) {
				// number button click
				e.preventDefault();
				handleIndex(parseInt(e.key));
			} else if (increaseKeys.includes(e.code)) {
				// next button click
				e.preventDefault();
				handleIndex((p) => p + 1);
			} else if (decreaseKeys.includes(e.code)) {
				// prev button click
				e.preventDefault();
				handleIndex((p) => p - 1);
			} else {
				// else check if action button was clicked
				const entry = currentId ? map.current.get(currentId) : null;

				if (!entry) return;

				const keyPress = e.key === " " ? "Space" : e.key;
				const action = entry.actions.find((action) => action.keys.includes(keyPress));

				if (!action) return;

				e.preventDefault();

				action.fn();
				if (action.items) {
					dispatch({ type: "setMode", payload: "action" });
					handleSetItems(action.items);
				}
			}
		};

		const handleDialogOpen = () => {
			if (mode !== "action") {
				dispatch({ type: "setMode", payload: "action" });
			}
		};

		const handleDialogClose = () => {
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

		const handleInputFocus = () => {
			dispatch({ type: "setMode", payload: "insert" });
		};

		const handleInputBlur = () => {
			dispatch({ type: "setMode", payload: "normal" });
		};

		const handleInputKeyDown = (e: Event) => {
			if ("key" in e && typeof e.key === "string" && escapeKeys.includes(e.key)) {
				e.preventDefault();
				const target = e.target as HTMLInputElement | HTMLTextAreaElement;
				target.blur();
			}
		};

		if (!isMobile) {
			document.addEventListener("keydown", handleKeyDown);
			document.addEventListener("dialog:close", handleDialogClose);
			document.addEventListener("dialog:open", handleDialogOpen);
			inputs.forEach((input) => {
				input.addEventListener("keydown", handleInputKeyDown);
				input.addEventListener("focus", handleInputFocus);
				input.addEventListener("blur", handleInputBlur);
			});
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("dialog:close", handleDialogClose);
			document.removeEventListener("dialog:open", handleDialogOpen);
			inputs.forEach((input) => {
				input.removeEventListener("keydown", handleInputKeyDown);
				input.removeEventListener("focus", handleInputFocus);
				input.removeEventListener("blur", handleInputBlur);
			});
		};
	}, [isMobile, mode, prevMode, dispatch, handleSetItems, currentId]);

	const register = (id: string): SlimElementProps => ({
		id,
		tabIndex: -1,
		"data-visual-item": true,
	});

	const getIsFocused = (id: string): boolean => {
		const focusableModes: SlimMode[] = ["visual", "action"];
		if (!currentId) return false;

		if (focusableModes.includes(mode)) {
			const isFocused = currentId === id;

			if (isFocused) {
				document
					.getElementById(id)
					?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
			}

			return isFocused;
		}

		return false;
	};

	const setInitialItems = (initialItems: SlimItem[]) => {
		if (mode !== "action") {
			handleSetItems(initialItems);
		}
	};

	return {
		register,
		getIsFocused,
		setInitialItems,
	};
}
