export type SlimMode = "normal" | "visual" | "action" | "insert";

export type SlimAction = {
	keys: string[];
	fn: () => void;
	items?: SlimItem[];
};

export type SlimItem = {
	id: string;
	actions: SlimAction[];
};

export type SlimElementProps = {
	id: string;
	tabIndex: number;
};

export type SlimElement = HTMLElement;

export type SlimMapEntry = {
	item: SlimItem;
	element: SlimElement;
};
