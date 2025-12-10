import { ConfirmDialog } from "@/components/modals/confirm-dialog";
import { useLanguage } from "@/modules/language/use-language";
import type { UsePersonModuleReturn } from "@/modules/person/use-person-module";
import type { ComponentProps } from "react";

type PersonRemoveModalProps = {
	personModule: UsePersonModuleReturn;
	confirmProps: ComponentProps<"button">;
	cancelProps: ComponentProps<"button">;
};

export function PersonRemoveModal({
	personModule,
	confirmProps,
	cancelProps,
}: PersonRemoveModalProps) {
	const { t } = useLanguage("person");
	const dialog = personModule.removeModal;
	const handleRemove = personModule.handleRemove;
	return (
		<ConfirmDialog
			{...dialog}
			title={t("remove.confirm.title")}
			description={t("remove.confirm.description")}
			onConfirm={handleRemove}
			confirmProps={confirmProps}
			cancelProps={cancelProps}
		/>
	);
}
