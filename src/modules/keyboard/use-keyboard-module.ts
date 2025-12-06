import { useIsMobile } from "@/hooks/use-mobile";
import { getNextIndex, isObjectWith, isValidIndex, toStringBoolean } from "@/lib/utils";
import type {
	SlimElementProps,
	SlimDispatch,
	SlimDispatchBase,
	SlimActions,
	SlimActionDefinition,
	SlimVisualElement,
} from "@/modules/keyboard/keyboard.schema";
import { useModeContext } from "@/modules/context/mode.context";
import { useEffect, useState } from "react";
import { TXT } from "@/lib/txt.namespace";
import { Obj } from "@/lib/obj.namespace";
import { useRangeContext } from "@/modules/context/range.context";

const focusedElementSelector = "[data-visual-item=true][data-focus=true]";
const visualElementSelector = "*[data-visual-item=true]";
const inputElementSelector = "input, textarea";

export type UseKeyboardModuleReturn = ReturnType<typeof useKeyboardModule>;

const stringSeparator = "_&_";

// TODO: When a modal is closed using the mouse, everything should reset
export function useKeyboardModule<T extends SlimDispatchBase>(dispatch: SlimDispatch<T>) {
	const isMobile = useIsMobile();
	const { range } = useRangeContext();
	const { mode, setMode, setKeys } = useModeContext();
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const getFocusedElement = (): SlimVisualElement | null => {
			const el = range.querySelector(focusedElementSelector) as HTMLElement | null;
			if (!el) return null;

			return Object.assign(el, {
				activate: () => {
					if (el instanceof HTMLInputElement) {
						return el.focus();
					}
					if (el instanceof HTMLTextAreaElement) {
						return el.focus();
					}
					return el.click();
				},
			});
		};

		const getVisualElements = (): HTMLElement[] | null => {
			const nodeList = range.querySelectorAll(visualElementSelector);
			if (nodeList.length === 0) return null;
			return Array.from(nodeList) as HTMLElement[];
		};

		const updateFocus = (elements: HTMLElement[], nextIndex?: number) => {
			for (const element of elements) {
				element.setAttribute("data-focus", toStringBoolean(false));
			}

			if (nextIndex === undefined) return;

			const focusedElement = elements[nextIndex];
			focusedElement.setAttribute("data-focus", toStringBoolean(true));
			focusedElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
		};

		const navigate = (elements: HTMLElement[], to: "next" | "prev" | number) => {
			setIndex((prevIndex) => {
				const isNormal = mode === "normal";
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

				updateFocus(elements, nextIndex);
				return nextIndex;
			});
		};

		const act = (e: KeyboardEvent) => {
			const actionKey = e.key === " " ? "Space" : e.key;

			const focusedElement = getFocusedElement();
			if (!focusedElement) return;

			const attrValue = focusedElement.getAttribute("data-actions");
			if (!attrValue) return [];

			const actions = TXT.split(";", attrValue).map((str) => {
				const [key, fn, payload] = TXT.split(stringSeparator, str, 3);
				return { key, fn, payload: payload !== "{}" ? JSON.parse(payload) : undefined };
			});

			if (!actions) return;

			const action = actions.find((a) => a.key === actionKey);

			if (!action) return;

			e.preventDefault();

			dispatch({ fn: action.fn, payload: action.payload } as T, focusedElement);
		};

		const reset = () => {
			setMode("normal");
			setKeys([]);
			requestAnimationFrame(() => {
				const elements = getVisualElements();
				if (elements) {
					updateFocus(elements);
				}
			});
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

			const elements = getVisualElements();
			if (!elements) {
				setMode("normal");
				return;
			}

			setKeys((p) => [...p, e.code]);

			if (isValidIndex(parseInt(e.key), elements)) {
				e.preventDefault();
				navigate(elements, parseInt(e.key));
				return;
			}

			if (nextKeys.includes(e.code)) {
				e.preventDefault();
				navigate(elements, "next");
				return;
			}

			if (prevKeys.includes(e.code)) {
				e.preventDefault();
				navigate(elements, "prev");
				return;
			}

			act(e);
		};

		const inputKeydown = (e: Event) => {
			const isKeyDown = isObjectWith<{ code: string }>(e, "code");
			if (!isKeyDown) return;
			const escapeKeys = ["Escape"];

			if (escapeKeys.includes(e.code)) {
				e.preventDefault();
				const target = e.target as HTMLInputElement | HTMLTextAreaElement;
				target.blur();
				reset();
				return;
			}
		};

		const inputFocus = () => {
			setMode("insert");
		};

		const inputBlur = () => {
			setMode("normal");
		};

		const inputs = Array.from(document.querySelectorAll(inputElementSelector));

		document.addEventListener("keydown", documentKeydown);
		inputs.forEach((input) => {
			input.addEventListener("keydown", inputKeydown);
			input.addEventListener("focus", inputFocus);
			input.addEventListener("blur", inputBlur);
		});
		return () => {
			document.removeEventListener("keydown", documentKeydown);
			inputs.forEach((input) => {
				input.removeEventListener("keydown", inputKeydown);
				input.removeEventListener("focus", inputFocus);
				input.removeEventListener("blur", inputBlur);
			});
		};
	}, [mode, index, range, isMobile, setMode, setKeys, dispatch]);

	const register = (id: string, actions: SlimActions<T>): SlimElementProps => {
		const entries = Obj.entries<SlimActionDefinition<T["fn"], T["payload"]>>(actions);
		const actionsAttr = entries
			.map(([key, a]) => [key, a.fn, JSON.stringify(a.payload ?? "{}")].join(stringSeparator))
			.join(";");
		return {
			id,
			tabIndex: -1,
			className: "data-[focus=true]:ring-primary ring ring-transparent",
			"data-visual-item": true,
			"data-actions": actionsAttr,
		};
	};

	return register;
}
