import { ConfirmDialog } from "@/components/modals/confirm-dialog";
import { useLanguage } from "@/modules/language/use-language";
import type { UsePersonModuleReturn } from "@/modules/person/use-person-module";

type PersonRemoveModalProps = {
	personModule: UsePersonModuleReturn;
};

export function PersonRemoveModal({ personModule }: PersonRemoveModalProps) {
	const { t } = useLanguage("person");
	const dialog = personModule.removeModal;
	const removeConfirmAction = personModule.removeConfirmAction;
	return (
		<ConfirmDialog
			{...dialog}
			title={t("remove.confirm.title")}
			description={t("remove.confirm.description")}
			onConfirm={removeConfirmAction}
		/>
	);
}
