import { ConfirmDialog } from "@/components/modals/confirm-dialog";
import { useLanguage } from "@/modules/language/use-language";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import type { ComponentProps } from "react";

type ThingRemoveModalProps = {
	thingModule: UseThingModuleReturn;
	confirmProps: ComponentProps<"button">;
	cancelProps: ComponentProps<"button">;
};

export function ThingRemoveModal({
	thingModule,
	confirmProps,
	cancelProps,
}: ThingRemoveModalProps) {
	const { t } = useLanguage("thing");
	const modal = thingModule.removeModal;
	const handleRemove = thingModule.handleRemove;
	const title = t("remove.confirm.title");
	const description = t("remove.confirm.description");

	return (
		<ConfirmDialog
			{...modal}
			title={title}
			description={description}
			onConfirm={handleRemove}
			confirmProps={confirmProps}
			cancelProps={cancelProps}
		/>
	);
}
