import { prefixId } from "@/lib/utils";
import { useId, useState } from "react";

export type DialogState = ReturnType<typeof useDialog>;

export interface DialogEvent extends CustomEvent {
	detail: { id: string };
}

declare global {
	interface DocumentEventMap {
		"dialog:open": DialogEvent;
		"dialog:close": DialogEvent;
	}
}

export function useDialog(defaultOpen?: boolean) {
	const [open, setOpen] = useState(defaultOpen ?? false);

	const generatedId = useId();
	const id = prefixId(generatedId, "dialog");

	const onOpenChange = (value: boolean) => {
		setOpen(value);
		const event = new CustomEvent(`dialog:${value ? "open" : "close"}`, {
			detail: { id },
			bubbles: true,
		});
		document.dispatchEvent(event);
	};

	return { open, onOpenChange, defaultOpen, id };
}
