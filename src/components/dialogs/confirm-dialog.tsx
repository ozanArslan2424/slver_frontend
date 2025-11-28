import { Dialog } from "@/components/ui/dialog";
import type { UseConfirmDialogReturn } from "@/hooks/use-confirm-dialog";

export function ConfirmDialog({
	open,
	onOpenChange,
	defaultOpen,
	onConfirm,
	onCancel,
	title,
	description,
	cancelText = "Cancel",
	confirmText = "Confirm",
}: UseConfirmDialogReturn) {
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			defaultOpen={defaultOpen}
			showTitle
			showDescription
			title={title}
			description={description}
		>
			<div className="grid grid-cols-3 gap-4">
				<button onClick={onCancel} className="ghost relative col-span-1">
					{cancelText}
					<kbd className="absolute top-1/2 right-2 -translate-y-1/2">n</kbd>
				</button>
				<button onClick={onConfirm} className="relative col-span-2">
					<span>{confirmText}</span>
					<kbd className="absolute top-1/2 right-2 -translate-y-1/2">y</kbd>
				</button>
			</div>
		</Dialog>
	);
}
