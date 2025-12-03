import { useIsMobile } from "@/hooks/use-mobile";
import { getNextIndex, isObjectWith, isValidIndex, toStringBoolean } from "@/lib/utils";
import type { SlimElementProps, SlimItem } from "@/modules/keyboard/keyboard.schema";
import { useModeContext } from "@/modules/context/mode.context";
import { useCallback, useEffect, useRef, useState } from "react";

const focusedElementSelector = "[data-visual-item=true][data-focus=true]";
const visualElementSelector = "*[data-visual-item=true]";
const inputElementSelector = "input, textarea";

export type UseKeyboardModuleReturn = ReturnType<typeof useKeyboardModule>;

export function useKeyboardModule() {
	const isMobile = useIsMobile();
	const { mode, setMode, setKeys } = useModeContext();
	const [range, setRange] = useState<HTMLElement>(document.documentElement);
	const [index, setIndex] = useState(0);
	const hash = useRef<string>("");
	const map = useRef(new Map<string, SlimItem>());

	const setItems = useCallback((items: SlimItem[]) => {
		let currentHash = "";

		for (let i = 0; i < items.length; i++) {
			currentHash += items[i].id;
			if (i < items.length - 1) currentHash += "|";
		}

		if (currentHash !== hash.current) {
			hash.current = currentHash;
			map.current.clear();

			requestAnimationFrame(() => {
				for (const item of items) {
					map.current.set(item.id, item);
				}
			});
		}
	}, []);

	useEffect(() => {
		console.log(index);

		const getInputElements = () => {
			return Array.from(document.querySelectorAll(inputElementSelector)) as HTMLElement[];
		};

		const getVisualElements = () => {
			const all = Array.from(range.querySelectorAll(visualElementSelector)) as HTMLElement[];
			const parentIds = Array.from(map.current.keys());
			return all.filter((el) => parentIds.includes(el.id));
		};

		const getFocusedElement = () => {
			return range.querySelector(focusedElementSelector) as HTMLElement | null;
		};

		const updateFocus = (nextIndex?: number) => {
			const elements = getVisualElements();

			for (const element of elements) {
				element.setAttribute("data-focus", toStringBoolean(false));
			}

			if (nextIndex === undefined) return;

			const focusedElement = elements[nextIndex];
			focusedElement.setAttribute("data-focus", toStringBoolean(true));
			focusedElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
		};

		const navigate = (to: "next" | "prev" | number) => {
			setIndex((prevIndex) => {
				const isNormal = mode === "normal";
				const elements = getVisualElements();
				let nextIndex: number = prevIndex;

				if (isNormal) {
					setMode("visual");
				}

				if (to === "next") {
					nextIndex = isNormal ? prevIndex : getNextIndex(prevIndex + 1, elements);
				} else if (to === "prev") {
					nextIndex = isNormal ? prevIndex : getNextIndex(prevIndex - 1, elements);
				} else {
					nextIndex = to;
				}

				updateFocus(nextIndex);
				return nextIndex;
			});
		};

		const reset = () => {
			setRange(document.documentElement);
			updateFocus();
			setMode("normal");
			setKeys([]);
		};

		const documentKeydown = (e: KeyboardEvent) => {
			if (isMobile) return;
			if (mode === "insert") return;

			const prevKeys = ["ArrowLeft", "ArrowUp", "Backspace"];
			const nextKeys = ["ArrowRight", "ArrowDown", "Tab"];
			const escapeKeys = ["Escape"];

			if (escapeKeys.includes(e.code)) {
				e.preventDefault();
				reset();
				return;
			}

			setKeys((p) => [...p, e.code]);

			if (isValidIndex(parseInt(e.key), map.current)) {
				e.preventDefault();
				navigate(parseInt(e.key));
				return;
			}

			if (nextKeys.includes(e.code)) {
				e.preventDefault();
				navigate("next");
				return;
			}

			if (prevKeys.includes(e.code)) {
				e.preventDefault();
				navigate("prev");
				return;
			}

			const focusedElement = getFocusedElement();
			if (!focusedElement) return;

			const item = map.current.get(focusedElement.id);
			const keyPress = e.key === " " ? "Space" : e.key;
			const action = item?.actions.find((action) => action.keys.includes(keyPress));
			if (!action) return;

			e.preventDefault();
			console.log(action.fn.toString());
			action.fn(focusedElement);
			requestAnimationFrame(() => {
				if (action.items && action.items.length !== 0) {
					const range = document.getElementById(action.rangeId);
					if (!range)
						throw new Error(
							`Can't have child actions without a range ID. Check your schema for: ${item?.id}`,
						);
					setRange(range);
					setItems(action.items);
					updateFocus();
				}
			});
		};

		const inputKeydown = (e: Event) => {
			const isKeyDown = isObjectWith<{ code: string }>(e, "code");
			if (!isKeyDown) return;
			const nextKeys = ["Tab"];
			const escapeKeys = ["Escape"];

			if (escapeKeys.includes(e.code)) {
				e.preventDefault();
				const target = e.target as HTMLInputElement | HTMLTextAreaElement;
				target.blur();
				reset();
				return;
			}

			if (nextKeys.includes(e.code)) {
				e.preventDefault();
				navigate("next");
				return;
			}
		};

		const inputFocus = () => {
			setMode("insert");
		};

		const inputBlur = () => {
			setMode("normal");
		};

		const inputs = getInputElements();
		range.addEventListener("keydown", documentKeydown);
		inputs.forEach((input) => {
			input.addEventListener("keydown", inputKeydown);
			input.addEventListener("focus", inputFocus);
			input.addEventListener("blur", inputBlur);
		});
		return () => {
			range.removeEventListener("keydown", documentKeydown);
			inputs.forEach((input) => {
				input.removeEventListener("keydown", inputKeydown);
				input.removeEventListener("focus", inputFocus);
				input.removeEventListener("blur", inputBlur);
			});
		};
	}, [mode, index, range, setItems, isMobile, setMode, setKeys]);

	const register = (id: string): SlimElementProps => ({
		id,
		tabIndex: -1,
		"data-visual-item": true,
	});

	const setInitialItems = (initialItems: SlimItem[]) => {
		if (range === document.documentElement) {
			setItems(initialItems);
		}
	};

	return {
		register,
		setInitialItems,
	};
}
