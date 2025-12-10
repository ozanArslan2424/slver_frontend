import { Checkbox } from "@/components/form/checkbox";
import { FormField } from "@/components/form/form-field";
import { FormRootError } from "@/components/form/form-root-error";
import { cn } from "@/lib/utils";
import type { UseGroupModuleReturn } from "@/modules/group/use-group-module";
import { useLanguage } from "@/modules/language/use-language";
import { AtSignIcon, Loader2Icon, ShieldUserIcon } from "lucide-react";
import { useState, type ComponentProps } from "react";

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
	const [isAdmin, setIsAdmin] = useState(false);
	const form = groupModule.inviteForm;

	return (
		<div className="flex h-max flex-1 flex-col gap-3 rounded-md transition-all">
			<form {...form.methods} className="flex flex-col gap-3">
				<div className="flex items-center gap-3">
					<div className="squircle xl primary">
						<AtSignIcon className="size-6" />
					</div>
					<FormField form={form} name="email" id="email">
						<input
							required
							placeholder={t("form.fields.email.label")}
							{...inputProps}
							className={cn("ghost", inputProps.className)}
						/>
					</FormField>
				</div>
				<div className="flex items-center gap-3">
					<FormField
						form={form}
						name="role"
						id="role"
						label={t("form.fields.role.label")}
						labelPlacement="right"
						labelClassName={cn(
							"input-like ghost unset min-h-0 cursor-pointer",
							isAdmin ? "text-foreground" : "text-foreground/50",
						)}
					>
						<Checkbox
							{...checkboxProps}
							onChange={setIsAdmin}
							className={cn("xl primary", checkboxProps.className)}
							renderChildren={() => <ShieldUserIcon className="size-6" />}
						/>
					</FormField>
				</div>

				<FormRootError form={form} />

				<button
					type="submit"
					{...submitProps}
					className={cn("soft lg w-full border-transparent", submitProps.className)}
				>
					{form.isPending ? <Loader2Icon className="animate-spin" /> : t("form.invite")}
				</button>
			</form>
		</div>
	);
}
