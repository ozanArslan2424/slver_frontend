import type { Ref } from "react";

export type KeyboardMode = "normal" | "visual" | "action" | "insert";

export type KeyboardElement = {
	id: string;
	keyActions: Record<string, (elId: string) => void>;
};

export type El = HTMLElement;

export type KeyboardElementProps<E extends El> = {
	ref: Ref<E>;
	id: string;
	tabIndex: number;
};
