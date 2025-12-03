export type SlimMode = "normal" | "visual" | "insert";

export type SlimAction =
	| {
			keys: string[];
			fn: (element: HTMLElement) => void;
			items?: undefined;
			rangeId?: undefined;
	  }
	| {
			keys: string[];
			fn: (element: HTMLElement) => void;
			items: SlimItem[];
			rangeId: string;
	  };

export type SlimItem = {
	id: string;
	actions: SlimAction[];
};

export type SlimElementProps = {
	id: string;
	tabIndex: -1;
	"data-visual-item": true;
};

export type SlimElement = HTMLElement;

export type SlimMapEntry = {
	item: SlimItem;
	element: SlimElement;
};
