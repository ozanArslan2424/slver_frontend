import { DatePicker } from "@/components/form/date-picker";
import { FormField } from "@/components/form/form-field";
import { cn, prefixId } from "@/lib/utils";
import type { UseKeyboardModuleReturn } from "@/modules/keyboard/use-keyboard-module";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { CalendarPlusIcon } from "lucide-react";

type ThingFormProps = {
	thingModule: UseThingModuleReturn;
	keyboardModule: UseKeyboardModuleReturn;
};

export function ThingForm({ thingModule, keyboardModule }: ThingFormProps) {
	const id = prefixId("form", "thing");

	return (
		<div
			className={cn(
				"flex h-max flex-1 flex-col gap-3 rounded-md outline-2 outline-offset-2 outline-transparent transition-all",
				keyboardModule.getIsFocused(id) && "outline-ring",
			)}
			{...keyboardModule.getElementProps(id)}
		>
			<form {...thingModule.createForm.methods} className="flex flex-col gap-2">
				<FormField form={thingModule.createForm} name="content" id="content">
					<textarea
						placeholder={thingModule.t("form.fields.title.label")}
						title={thingModule.t("form.fields.title.title")}
						required
						className="bg-card border-card min-h-20"
						ref={thingModule.textareaRef}
						disabled={thingModule.createMutation.isPending}
					/>
				</FormField>
				<div className="flex items-center gap-2">
					<FormField
						form={thingModule.createForm}
						name="dueDate"
						id="dueDate"
						className="w-min max-w-min"
					>
						<DatePicker
							placeholder={thingModule.t("form.fields.dueDate.label")}
							startDate={new Date()}
							endDate={new Date(2040, 0, 1)}
							renderTrigger={(open) => (
								<button
									disabled={thingModule.createMutation.isPending}
									type="button"
									className={cn(
										"square size-10 border-transparent",
										open ? "primary" : "soft text-foreground/70 hover:text-foreground",
									)}
								>
									<CalendarPlusIcon className="size-5" />
								</button>
							)}
						/>
					</FormField>
					<button
						type="submit"
						className="soft h-10 w-full flex-1 border-transparent"
						disabled={thingModule.createMutation.isPending}
					>
						{thingModule.t("form.submit")}
					</button>
				</div>
			</form>
		</div>
	);
}
