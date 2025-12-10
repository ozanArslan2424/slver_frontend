import { FormField } from "@/components/form/form-field";
import { FormRootError } from "@/components/form/form-root-error";
import { cn } from "@/lib/utils";
import type { UseGroupModuleReturn } from "@/modules/group/use-group-module";
import { useLanguage } from "@/modules/language/use-language";
import { Loader2Icon } from "lucide-react";
import type { ComponentProps } from "react";

type GroupFormProps = {
	groupModule: UseGroupModuleReturn;
	inputProps: ComponentProps<"input">;
	submitProps: ComponentProps<"button">;
};

export function GroupCreateForm({ groupModule, inputProps, submitProps }: GroupFormProps) {
	const { t } = useLanguage("group");
	const form = groupModule.createForm;

	return (
		<div className={cn("flex h-max flex-1 flex-col gap-3 rounded-md transition-all")}>
			<form {...form.methods} className="flex flex-col gap-2">
				<FormField form={form} name="title" id="title">
					<input
						required
						placeholder={t("form.fields.title.label")}
						{...inputProps}
						className={cn("bg-card border-card", inputProps.className)}
					/>
				</FormField>

				<FormRootError form={form} />

				<button
					type="submit"
					{...submitProps}
					className={cn("soft h-10 w-full border-transparent", submitProps.className)}
				>
					{form.isPending ? <Loader2Icon className="animate-spin" /> : t("form.create")}
				</button>
			</form>
		</div>
	);
}
