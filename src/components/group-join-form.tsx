import { FormField } from "@/components/form/form-field";
import { FormRootError } from "@/components/form/form-root-error";
import { cn, prefixId } from "@/lib/utils";
import type { UseGroupModuleReturn } from "@/modules/group/use-group-module";
import type { UseKeyboardModuleReturn } from "@/modules/keyboard/use-keyboard-module";
import { Loader2Icon } from "lucide-react";

type GroupFormProps = {
	groupModule: UseGroupModuleReturn;
	keyboardModule: UseKeyboardModuleReturn;
};

export function GroupJoinForm({ groupModule, keyboardModule }: GroupFormProps) {
	const id = prefixId("join", "group");
	const form = groupModule.joinForm;

	return (
		<div
			className={cn(
				"flex h-max flex-1 flex-col gap-3 rounded-md outline-2 outline-offset-2 outline-transparent transition-all",
				keyboardModule.getIsFocused(id) && "outline-ring",
			)}
			{...keyboardModule.getElementProps(id)}
		>
			<form {...form.methods} className="flex flex-col gap-2">
				<FormField form={form} name="join" id="join">
					<input
						required
						ref={groupModule.joinInputRef}
						className="bg-card border-card"
						placeholder={groupModule.t("form.fields.join.label")}
					/>
				</FormField>

				<FormRootError form={form} />

				<button type="submit" className="soft h-10 w-full border-transparent">
					{form.isPending ? <Loader2Icon className="animate-spin" /> : groupModule.t("form.join")}
				</button>
			</form>
		</div>
	);
}
