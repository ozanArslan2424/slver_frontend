import { useModeContext } from "@/modules/keyboard/mode.context";
import { useCallback, useState } from "react";

export function useDialog(defaultOpen?: boolean) {
	const modeCtx = useModeContext();
	const [open, setOpen] = useState(defaultOpen ?? false);

	const handleOpenChange = useCallback((value: boolean) => {
		setOpen(value);
		// TODO: The mode should be action if any dialog is open, it should also be consistent from one dialog to the next
		// modeCtx.setMode(value ? "action" : "normal");
	}, []);

	return { open, onOpenChange: handleOpenChange, defaultOpen };
}

export type DialogState = ReturnType<typeof useDialog>;
