import { isValidIndex } from "@/lib/utils";
import type { KeyboardElement, El, KeyboardElementProps } from "@/modules/keyboard/keyboard.schema";
import { useModeContext } from "@/modules/keyboard/mode.context";
import { useRef, useCallback, useEffect } from "react";

export type UseKeyboardModuleReturn = ReturnType<typeof useKeyboardModule>;

export function useKeyboardModule(els: KeyboardElement[]) {
	const { currentFocusIndex, setCurrentFocusIndex, mode, setMode, setKeysBuffer } =
		useModeContext();

	const inputRef = useRef<El | null>(null);
	const elementRefs = useRef<El[]>([]);

	useEffect(() => {
		elementRefs.current = elementRefs.current.slice(0, Object.keys(els).length);
	}, [els]);

	const handleNavigation = useCallback(
		(e: KeyboardEvent) => {
			if (isValidIndex(parseInt(e.key), els)) {
				e.preventDefault();
				setCurrentFocusIndex(parseInt(e.key));
				return;
			}

			if (["ArrowRight", "ArrowDown", "Tab"].includes(e.code)) {
				e.preventDefault();
				const totalEls = elementRefs.current.length;
				setCurrentFocusIndex((currentFocusIndex + 1) % totalEls);
				return;
			}

			if (["ArrowLeft", "ArrowUp", "Backspace"].includes(e.code)) {
				e.preventDefault();
				const totalEls = elementRefs.current.length;
				setCurrentFocusIndex((currentFocusIndex - 1 + totalEls) % totalEls);
				return;
			}
		},
		[els, currentFocusIndex, setCurrentFocusIndex],
	);

	const handleAction = useCallback(
		(e: KeyboardEvent) => {
			const elId = elementRefs.current[currentFocusIndex].id;
			const el = els.find((el) => el.id === elId);
			if (!el) return;

			const keyPress = e.key === " " ? "Space" : e.key;
			const isActionKey = Object.keys(el.keyActions).includes(keyPress);
			if (!isActionKey) return;

			e.preventDefault();
			el.keyActions[keyPress](elId);
		},
		[els, currentFocusIndex],
	);

	const handleEscapeKey = useCallback(
		(e: KeyboardEvent) => {
			const escapeKeys = ["Escape"];
			if (mode !== "insert") {
				escapeKeys.push("KeyQ");
			}
			const isEscapeKey = escapeKeys.includes(e.code);
			if (!isEscapeKey) return;
			setMode("normal");
			setKeysBuffer([]);
			if (inputRef.current) {
				inputRef.current.blur();
				inputRef.current = null;
			}
		},
		[mode, setMode, setKeysBuffer],
	);

	const handleKeySequence = useCallback(
		(e: KeyboardEvent) => {
			setKeysBuffer((prev) => [...prev, e.code]);

			const isNumKey = isValidIndex(parseInt(e.key), els);
			if (isNumKey) {
				e.preventDefault();
				setMode("visual");
				setCurrentFocusIndex(parseInt(e.key));
				return;
			}

			const isNavKey = [
				"ArrowLeft",
				"ArrowDown",
				"Tab",
				"ArrowUp",
				"ArrowRight",
				"Backspace",
			].includes(e.code);

			if (isNavKey) {
				e.preventDefault();
				setMode("visual");
				return;
			}
		},
		[els, setKeysBuffer, setMode, setCurrentFocusIndex],
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			switch (mode) {
				case "normal":
					handleKeySequence(e);
					break;
				case "visual":
					handleKeySequence(e);
					handleEscapeKey(e);
					handleNavigation(e);
					handleAction(e);
					break;
				case "action":
					handleEscapeKey(e);
					break;
				case "insert":
					handleEscapeKey(e);
					break;
				default:
					break;
			}
		},
		[mode, handleNavigation, handleAction, handleEscapeKey, handleKeySequence],
	);

	const handleFocus = useCallback(
		(e: Event) => {
			inputRef.current = e.currentTarget as El;
			setMode("insert");
		},
		[setMode],
	);

	const handleBlur = useCallback(() => {
		setMode("normal");
	}, [setMode]);

	useEffect(() => {
		const inputs = document.querySelectorAll("input, textarea");

		document.addEventListener("keydown", handleKeyDown);
		inputs.forEach((el) => {
			el.addEventListener("focus", handleFocus);
			el.addEventListener("blur", handleBlur);
		});

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			inputs.forEach((el) => {
				el.removeEventListener("focus", handleFocus);
				el.removeEventListener("blur", handleBlur);
			});
		};
	}, [handleKeyDown, handleFocus, handleBlur]);

	const getElementProps = useCallback(
		<E extends El>(id: string): KeyboardElementProps<E> => {
			return {
				id,
				tabIndex: -1,
				ref: (element: E) => {
					const index = els.findIndex((el) => el.id === id);
					elementRefs.current[index] = element;
				},
			};
		},
		[els],
	);

	const getIsFocused = useCallback(
		(id: string): boolean => {
			if (mode !== "visual" && mode !== "action") return false;

			const isFocused = currentFocusIndex === els.findIndex((el) => el.id === id);

			if (isFocused) {
				// Find and scroll the element into view
				const element = document.getElementById(id);
				if (element) {
					element.scrollIntoView();
				}
			}

			return isFocused;
		},
		[els, mode, currentFocusIndex],
	);

	return {
		getElementProps,
		getIsFocused,
	};
}
