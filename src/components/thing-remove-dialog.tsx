import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { cn, prefixId } from "@/lib/utils";
import type { UseKeyboardModuleReturn } from "@/modules/keyboard/use-keyboard-module";
import { useLanguage } from "@/modules/language/use-language";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";

type ThingRemoveDialogProps = {
	thingModule: UseThingModuleReturn;
	keyboardModule: UseKeyboardModuleReturn;
};

export function ThingRemoveDialog({ thingModule, keyboardModule }: ThingRemoveDialogProps) {
	const { t } = useLanguage("thing");
	const dialog = thingModule.removeDialog;
	const handleConfirmRemove = thingModule.handleConfirmRemove;
	const confirmId = prefixId("confirm", "thing_remove");
	const cancelId = prefixId("cancel", "thing_remove");

	return (
		<ConfirmDialog
			{...dialog}
			title={t("remove.confirm.title")}
			description={t("remove.confirm.description")}
			onConfirm={handleConfirmRemove}
			confirmProps={{
				...keyboardModule.register(confirmId),
				className: cn(
					"outline-2 outline-offset-2 outline-transparent",
					keyboardModule.getIsFocused(confirmId) && "outline-ring",
				),
			}}
			cancelProps={{
				...keyboardModule.register(cancelId),
				className: cn(
					"outline-2 outline-offset-2 outline-transparent",
					keyboardModule.getIsFocused(cancelId) && "outline-ring",
				),
			}}
		/>
	);
}
