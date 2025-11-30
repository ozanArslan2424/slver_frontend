import { Dialog } from "./dialog";
import type { DialogState } from "@/hooks/use-dialog";
import { cn, prefixId } from "@/lib/utils";
import { useLanguage } from "@/modules/language/use-language";
import type { ComponentProps } from "react";

type ConfirmDialogProps = DialogState & {
	title: string;
	description: string;
	confirmProps?: Omit<ComponentProps<"button">, "onClick">;
	cancelProps?: Omit<ComponentProps<"button">, "onClick">;
	onCancel?: () => void;
	onConfirm: () => void;
};

export function ConfirmDialog({
	confirmProps,
	cancelProps,
	onConfirm,
	onCancel,
	id,
	...dialog
}: ConfirmDialogProps) {
	const { t: tCommon } = useLanguage("common");

	function handleCancel() {
		onCancel?.();
		dialog.onOpenChange(false);
	}

	function handleConfirm() {
		onConfirm();
		dialog.onOpenChange(false);
	}

	return (
		<Dialog showTitle showDescription id={prefixId(id, "confirm")} {...dialog}>
			<div className="grid grid-cols-3 gap-4">
				<button
					onClick={handleCancel}
					{...cancelProps}
					className={cn("ghost relative col-span-1", cancelProps?.className)}
				>
					{cancelProps?.children ?? tCommon("cancel")}
				</button>
				<button
					onClick={handleConfirm}
					{...confirmProps}
					className={cn("relative col-span-2", confirmProps?.className)}
				>
					{confirmProps?.children ?? tCommon("confirm")}
				</button>
			</div>
		</Dialog>
	);
}
