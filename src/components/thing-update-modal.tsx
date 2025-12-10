import { Dialog } from "@/components/modals/dialog";
import { Combobox } from "@/components/form/combobox";
import { DatePicker } from "@/components/form/date-picker";
import { FormField } from "@/components/form/form-field";
import type { UsePersonModuleReturn } from "@/modules/person/use-person-module";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { CalendarPlusIcon, ChevronDownIcon } from "lucide-react";
import { PersonAvatar } from "@/components/ui/person-avatar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/modules/language/use-language";
import type { ComponentProps } from "react";

type ThingUpdateModalProps = {
	thingModule: UseThingModuleReturn;
	personModule: UsePersonModuleReturn;
	textareaProps: ComponentProps<"textarea">;
	datepickerProps: ComponentProps<"button">;
	comboboxProps: ComponentProps<"button">;
	cancelProps: ComponentProps<"button">;
	submitProps: ComponentProps<"button">;
};

export function ThingUpdateModal({
	thingModule,
	personModule,
	textareaProps,
	datepickerProps,
	comboboxProps,
	cancelProps,
	submitProps,
}: ThingUpdateModalProps) {
	const { t, timestamp } = useLanguage("thing");
	const thing = thingModule.active;
	const modal = thingModule.updateModal;
	const form = thingModule.updateForm;
	const isPending = form.isPending;

	if (!thing) return null;
	return (
		<Dialog {...modal} showTitle title={t("update.title")} description={t("update.description")}>
			<form {...form.methods} className="flex flex-col gap-3">
				<div className="flex flex-1 flex-col gap-3">
					<FormField form={form} name="content" id="content" label={t("form.content.label")}>
						<textarea
							{...textareaProps}
							className={cn("min-h-40", textareaProps.className)}
							placeholder={t("")}
							required
							disabled={isPending}
							spellCheck
						/>
					</FormField>

					<FormField form={form} name="dueDate" id="dueDate" label={t("form.dueDate.label")}>
						<DatePicker
							startDate={new Date()}
							endDate={new Date(2040, 0, 1)}
							renderTrigger={(open, val) => (
								<button
									{...datepickerProps}
									className={cn(
										"outlined neon lg w-full justify-between font-normal",
										datepickerProps.className,
									)}
									disabled={isPending}
								>
									<div className="flex items-center gap-3">
										<div className="squircle size-7 font-black">
											<CalendarPlusIcon className="size-4" />
										</div>
										{val ? timestamp(val).shortDate : t("form.fields.dueDate.label")}
									</div>
									<ChevronDownIcon
										className={cn("transition-all", open ? "rotate-180" : "rotate-0")}
									/>
								</button>
							)}
						/>
					</FormField>

					<FormField
						form={form}
						name="assignedToId"
						id="assignedToId"
						label={t("form.assignedToId.label")}
					>
						<Combobox
							side="bottom"
							options={(personModule.listQuery.data ?? []).map((person) => ({
								label: person.name,
								value: person.id.toString(),
								...person,
							}))}
							renderTrigger={(open, val) => (
								<button
									{...comboboxProps}
									className={cn(
										"outlined neon lg w-full justify-between font-normal",
										comboboxProps.className,
									)}
									disabled={isPending}
								>
									<div className="flex items-center gap-3">
										<PersonAvatar
											person={val ? val : { name: "?", image: undefined }}
											className="size-7 font-black"
										/>
										{val
											? t("detail.fields.assignedTo.somebody", {
													name: val.name,
												})
											: t("detail.fields.assignedTo.nobody")}
									</div>

									<ChevronDownIcon
										className={cn("transition-all", open ? "rotate-180" : "rotate-0")}
									/>
								</button>
							)}
						/>
					</FormField>
				</div>

				<div className="grid grid-cols-3 items-center gap-2">
					<button
						type="reset"
						{...cancelProps}
						className={cn("ghost col-span-1", cancelProps.className)}
						disabled={isPending}
					>
						{t("form.cancel")}
					</button>
					<button
						type="submit"
						{...submitProps}
						className={cn("col-span-2", submitProps.className)}
						disabled={isPending}
					>
						{t("form.submit")}
					</button>
				</div>
			</form>
		</Dialog>
	);
}
