export type SlimVisualElement = HTMLElement & {
	activate: () => void;
};

export type SlimMode = "normal" | "visual" | "insert";

export const slimKeys = [
	"Enter",
	"Space",
	"Escape",
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
];

export type SlimKey = (typeof slimKeys)[number];

export type SlimActionDefinition<F, P> = {
	fn: F;
	payload?: P;
};

export type SlimElementProps = {
	id: string;
	tabIndex: -1;
	"data-visual-item": true;
	"data-actions": string;
	className: string;
};

export type SlimDispatchBase = { fn: string; payload?: unknown };
export type SlimDispatch<T extends SlimDispatchBase> = (action: T, el: SlimVisualElement) => void;
export type SlimActions<T extends SlimDispatchBase> = Record<SlimKey, T>;
