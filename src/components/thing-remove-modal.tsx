import { ConfirmDialog } from "@/components/modals/confirm-dialog";
import { prefixId } from "@/lib/utils";
import type { UseKeyboardModuleReturn } from "@/modules/keyboard/use-keyboard-module";
import { useLanguage } from "@/modules/language/use-language";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";

type ThingRemoveModalProps = {
	thingModule: UseThingModuleReturn;
	keyboardModule: UseKeyboardModuleReturn;
};

export function ThingRemoveModal({ thingModule, keyboardModule }: ThingRemoveModalProps) {
	const { t } = useLanguage("thing");
	const modal = thingModule.removeModal;
	const removeConfirmAction = thingModule.removeConfirmAction;
	const removeCancelAction = thingModule.removeCancelAction;
	const confirmId = prefixId("confirm", "thing_remove");
	const cancelId = prefixId("cancel", "thing_remove");
	const title = t("remove.confirm.title");
	const description = t("remove.confirm.description");

	return (
		<ConfirmDialog
			{...modal}
			title={title}
			description={description}
			onConfirm={removeConfirmAction}
			onCancel={removeCancelAction}
			confirmProps={{
				...keyboardModule.register(confirmId),
				className: "data-[focus=true]:ring-primary ring ring-transparent",
			}}
			cancelProps={{
				...keyboardModule.register(cancelId),
				className: "data-[focus=true]:ring-primary ring ring-transparent",
			}}
		/>
	);
}
