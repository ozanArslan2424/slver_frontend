import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import type { UsePersonModuleReturn } from "@/modules/person/use-person-module";

type PersonRemoveDialogProps = {
	personModule: UsePersonModuleReturn;
};

export function PersonRemoveDialog({ personModule }: PersonRemoveDialogProps) {
	const t = personModule.t;
	const dialog = personModule.removeDialog;
	const handleConfirmRemove = personModule.handleConfirmRemove;
	return (
		<ConfirmDialog
			{...dialog}
			title={t("remove.confirm.title")}
			description={t("remove.confirm.description")}
			onConfirm={handleConfirmRemove}
		/>
	);
}
