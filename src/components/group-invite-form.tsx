import { Checkbox } from "@/components/form/checkbox";
import { FormField } from "@/components/form/form-field";
import { FormRootError } from "@/components/form/form-root-error";
import { cn } from "@/lib/utils";
import type { UseGroupModuleReturn } from "@/modules/group/use-group-module";
import { useLanguage } from "@/modules/language/use-language";
import { Loader2Icon, ShieldUserIcon } from "lucide-react";
import type { ComponentProps } from "react";

type GroupFormProps = {
	groupModule: UseGroupModuleReturn;
	inputProps: ComponentProps<"input">;
	checkboxProps: ComponentProps<typeof Checkbox>;
	submitProps: ComponentProps<"button">;
};

export function GroupInviteForm({
	groupModule,
	inputProps,
	checkboxProps,
	submitProps,
}: GroupFormProps) {
	const { t } = useLanguage("group");
	const form = groupModule.inviteForm;

	return (
		<div className="flex h-max flex-1 flex-col gap-3 rounded-md transition-all">
			<form {...form.methods} className="flex flex-col gap-2">
				<div className="flex gap-2">
					<FormField form={form} name="email" id="email">
						<input
							required
							placeholder={t("form.fields.email.label")}
							{...inputProps}
							className={cn("bg-card border-card", inputProps.className)}
						/>
					</FormField>
					<FormField
						className="contents"
						form={form}
						name="role"
						id="role"
						tooltip={t("form.fields.role.label")}
					>
						<Checkbox
							{...checkboxProps}
							className={cn("size-10 border-transparent", checkboxProps.className)}
							renderChildren={() => <ShieldUserIcon className={cn("size-5")} />}
						/>
					</FormField>
				</div>

				<FormRootError form={form} />

				<button
					type="submit"
					{...submitProps}
					className={cn("soft h-10 w-full border-transparent", submitProps.className)}
				>
					{form.isPending ? <Loader2Icon className="animate-spin" /> : t("form.invite")}
				</button>
			</form>
		</div>
	);
}
