import { FormField } from "@/components/form/form-field";
import { FormRootError } from "@/components/form/form-root-error";
import { cn, prefixId } from "@/lib/utils";
import type { UseGroupModuleReturn } from "@/modules/group/use-group-module";
import type { UseKeyboardModuleReturn } from "@/modules/keyboard/use-keyboard-module";
import { useLanguage } from "@/modules/language/use-language";
import { Loader2Icon } from "lucide-react";

type GroupFormProps = {
	groupModule: UseGroupModuleReturn;
	keyboardModule: UseKeyboardModuleReturn;
};

export function GroupJoinForm({ groupModule, keyboardModule }: GroupFormProps) {
	const { t } = useLanguage("group");
	const id = prefixId("join", "group");
	const form = groupModule.joinForm;
	const inputRef = groupModule.joinInputRef;

	return (
		<div
			className={cn(
				"flex h-max flex-1 flex-col gap-3 rounded-md transition-all",
				"data-[focus=true]:ring-primary ring ring-transparent",
			)}
			{...keyboardModule.register(id)}
		>
			<form {...form.methods} className="flex flex-col gap-2">
				<FormField form={form} name="join" id="join">
					<input
						required
						ref={inputRef}
						className="bg-card border-card"
						placeholder={t("form.fields.join.label")}
					/>
				</FormField>

				<FormRootError form={form} />

				<button type="submit" className="soft h-10 w-full border-transparent">
					{form.isPending ? <Loader2Icon className="animate-spin" /> : t("form.join")}
				</button>
			</form>
		</div>
	);
}
