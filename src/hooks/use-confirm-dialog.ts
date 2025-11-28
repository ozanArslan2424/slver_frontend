import { useDialog } from "@/hooks/use-dialog";
import { useCallback, useEffect } from "react";

type UseConfirmDialogArgs = {
	title: string;
	description: string;
	cancelText?: string;
	confirmText?: string;
	onConfirm: () => void;
	onCancel?: () => void;
};

export function useConfirmDialog(args: UseConfirmDialogArgs) {
	const dialog = useDialog();

	const handleCancel = useCallback(() => {
		args.onCancel?.();
		dialog.onOpenChange(false);
	}, [args, dialog]);

	const handleConfirm = useCallback(() => {
		args.onConfirm();
		dialog.onOpenChange(false);
	}, [args, dialog]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (["KeyY"].includes(e.code)) {
				e.preventDefault();
				handleConfirm();
				return;
			}

			if (["KeyQ", "KeyN"].includes(e.code)) {
				e.preventDefault();
				handleCancel();
				return;
			}
		};

		if (dialog.open) {
			document.addEventListener("keydown", handleKeyDown);
		}

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleCancel, handleConfirm, dialog]);

	return {
		...args,
		...dialog,
		onConfirm: handleConfirm,
		onCancel: handleCancel,
	};
}

export type UseConfirmDialogReturn = ReturnType<typeof useConfirmDialog>;
