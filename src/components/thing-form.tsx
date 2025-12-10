import { DatePicker } from "@/components/form/date-picker";
import { FormField } from "@/components/form/form-field";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/modules/language/use-language";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { CalendarPlusIcon } from "lucide-react";
import type { ComponentProps } from "react";

type ThingFormProps = {
	thingModule: UseThingModuleReturn;
	textareaProps: ComponentProps<"textarea">;
	datePickerProps: ComponentProps<"button">;
	submitProps: ComponentProps<"button">;
};

export function ThingForm({
	thingModule,
	textareaProps,
	datePickerProps,
	submitProps,
}: ThingFormProps) {
	const { t } = useLanguage("thing");
	const form = thingModule.createForm;

	return (
		<div className="flex h-max flex-1 flex-col gap-3 rounded-md transition-all">
			<form {...form.methods} className="flex flex-col gap-2">
				<FormField form={form} name="content" id="content">
					<textarea
						placeholder={t("form.content.label")}
						required
						disabled={form.isPending}
						{...textareaProps}
						className={cn("bg-card border-card min-h-20", textareaProps.className)}
						spellCheck
					/>
				</FormField>

				<div className="flex items-center gap-2">
					<FormField form={form} name="dueDate" id="dueDate" className="w-min max-w-min">
						<DatePicker
							placeholder={t("form.dueDate.label")}
							startDate={new Date()}
							endDate={new Date(2040, 0, 1)}
							renderTrigger={(open, value) => (
								<button
									disabled={form.isPending}
									type="button"
									{...datePickerProps}
									className={cn(
										"square size-10 border-transparent",
										open || value !== undefined
											? "primary"
											: "soft text-foreground/70 hover:text-foreground",
										datePickerProps.className,
									)}
								>
									<CalendarPlusIcon className="size-5" />
								</button>
							)}
						/>
					</FormField>
					<button
						type="submit"
						disabled={form.isPending}
						{...submitProps}
						className={cn("soft h-10 w-full flex-1 border-transparent", submitProps.className)}
					>
						{t("form.submit")}
					</button>
				</div>
			</form>
		</div>
	);
}
