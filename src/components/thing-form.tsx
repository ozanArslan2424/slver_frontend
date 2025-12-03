import { DatePicker } from "@/components/form/date-picker";
import { FormField } from "@/components/form/form-field";
import { cn, prefixId } from "@/lib/utils";
import type { UseKeyboardModuleReturn } from "@/modules/keyboard/use-keyboard-module";
import { useLanguage } from "@/modules/language/use-language";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { CalendarPlusIcon } from "lucide-react";

type ThingFormProps = {
	thingModule: UseThingModuleReturn;
	keyboardModule: UseKeyboardModuleReturn;
};

export function ThingForm({ thingModule, keyboardModule }: ThingFormProps) {
	const { t } = useLanguage("thing");
	const form = thingModule.createForm;
	const mutation = thingModule.createMutation;
	const isPending = mutation.isPending;
	const textareaRef = thingModule.textareaRef;
	const id = prefixId("form", "thing");
	const contentId = prefixId("content", "thing_form");
	const dueDateId = prefixId("dueDate", "thing_form");

	function handleRetry() {
		if (mutation.isError) {
			mutation.mutate(mutation.variables);
		}
	}

	return (
		<div
			className={cn(
				"flex h-max flex-1 flex-col gap-3 rounded-md transition-all",
				"data-[focus=true]:ring-primary ring ring-transparent",
			)}
			{...keyboardModule.register(id)}
		>
			<form {...form.methods} className="flex flex-col gap-2">
				<FormField form={form} name="content" id="content">
					<textarea
						placeholder={t("form.fields.title.label")}
						title={t("form.fields.title.title")}
						required
						className={cn(
							"bg-card border-card min-h-20",
							"data-[focus=true]:ring-primary ring ring-transparent",
						)}
						ref={textareaRef}
						disabled={isPending}
						{...keyboardModule.register(contentId)}
					/>
				</FormField>

				{mutation.isError && (
					<button
						type="button"
						onClick={handleRetry}
						className="unset rounded-md bg-rose-500/10 px-5 py-2 text-center text-sm font-semibold text-red-600 hover:bg-rose-500/5"
					>
						{t("retry.update")}
					</button>
				)}

				<div className="flex items-center gap-2">
					<FormField form={form} name="dueDate" id="dueDate" className="w-min max-w-min">
						<DatePicker
							placeholder={t("form.fields.dueDate.label")}
							startDate={new Date()}
							endDate={new Date(2040, 0, 1)}
							renderTrigger={(open) => (
								<button
									{...keyboardModule.register(dueDateId)}
									disabled={isPending}
									type="button"
									className={cn(
										"square size-10 border-transparent",
										open ? "primary" : "soft text-foreground/70 hover:text-foreground",
										"data-[focus=true]:ring-primary ring ring-transparent",
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
						disabled={isPending}
					>
						{t("form.submit")}
					</button>
				</div>
			</form>
		</div>
	);
}
