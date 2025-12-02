import { prefixId } from "@/lib/utils";
import { useId, useState } from "react";

export type DialogState = ReturnType<typeof useModal>;

export interface DialogEvent extends CustomEvent {
	detail: { id: string };
}

// TODO: Keep a global context for open dialogs,
// radix executes close for all dialogs regardless of current state
declare global {
	interface DocumentEventMap {
		"dialog:open": DialogEvent;
		"dialog:close": DialogEvent;
	}
}

export function useModal(defaultOpen?: boolean) {
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
