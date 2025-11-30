import { Checkbox } from "@/components/form/checkbox";
import { FormField } from "@/components/form/form-field";
import { FormRootError } from "@/components/form/form-root-error";
import { cn, prefixId } from "@/lib/utils";
import type { UseGroupModuleReturn } from "@/modules/group/use-group-module";
import type { UseKeyboardModuleReturn } from "@/modules/keyboard/use-keyboard-module";
import { Loader2Icon, ShieldUserIcon } from "lucide-react";

type GroupFormProps = {
	groupModule: UseGroupModuleReturn;
	keyboardModule: UseKeyboardModuleReturn;
};

export function GroupInviteForm({ groupModule, keyboardModule }: GroupFormProps) {
	const id = prefixId("invite", "group");
	const form = groupModule.inviteForm;

	return (
		<div
			className={cn(
				"flex h-max flex-1 flex-col gap-3 rounded-md outline-2 outline-offset-2 outline-transparent transition-all",
				keyboardModule.getIsFocused(id) && "outline-ring",
			)}
			{...keyboardModule.register(id)}
		>
			<form {...form.methods} className="flex flex-col gap-2">
				<div className="flex gap-2">
					<FormField form={form} name="email" id="email">
						<input
							required
							ref={groupModule.inviteInputRef}
							className="bg-card border-card"
							placeholder={groupModule.t("form.fields.email.label")}
						/>
					</FormField>
					<FormField
						className="contents"
						form={form}
						name="role"
						id="role"
						tooltip={groupModule.t("form.fields.role.label")}
					>
						<Checkbox
							className="size-10 border-transparent"
							renderChildren={() => <ShieldUserIcon className={cn("size-5")} />}
						/>
					</FormField>
				</div>

				<FormRootError form={form} />

				<button type="submit" className="soft h-10 w-full border-transparent">
					{form.isPending ? <Loader2Icon className="animate-spin" /> : groupModule.t("form.invite")}
				</button>
			</form>
		</div>
	);
}
