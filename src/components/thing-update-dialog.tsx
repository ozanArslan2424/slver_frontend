import { Dialog } from "@/components/ui/dialog";
import { Combobox } from "@/components/form/combobox";
import { DatePicker } from "@/components/form/date-picker";
import { FormField } from "@/components/form/form-field";
import type { UsePersonModuleReturn } from "@/modules/person/use-person-module";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { CalendarPlusIcon, ChevronDownIcon } from "lucide-react";
import { PersonAvatar } from "@/components/ui/person-avatar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/modules/language/use-language";

type ThingUpdateDialogProps = {
	thingModule: UseThingModuleReturn;
	personModule: UsePersonModuleReturn;
};

export function ThingUpdateDialog({ thingModule, personModule }: ThingUpdateDialogProps) {
	const { t, timestamp } = useLanguage("thing");
	const thing = thingModule.active;
	const form = thingModule.updateForm;
	const dialog = thingModule.updateDialog;
	const textareaRef = thingModule.textareaRef;

	if (!thing) return null;
	return (
		<Dialog {...dialog} showTitle title={t("update.title")} description={t("update.description")}>
			<form {...form.methods} className="flex flex-col gap-3">
				<div className="flex flex-1 flex-col gap-3">
					<FormField form={form} name="content" id="content">
						<textarea
							placeholder={t("form.fields.title.label")}
							title={t("form.fields.title.title")}
							required
							className="min-h-40"
							ref={textareaRef}
						/>
					</FormField>

					<FormField form={form} name="dueDate" id="dueDate">
						<DatePicker
							startDate={new Date()}
							endDate={new Date(2040, 0, 1)}
							renderTrigger={(open, val) => (
								<button className="outlined neon lg w-full justify-between font-normal">
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

					<FormField form={form} name="assignedToId" id="assignedToId">
						<Combobox
							side="bottom"
							options={(personModule.listQuery.data ?? []).map((person) => ({
								label: person.name,
								value: person.id.toString(),
								...person,
							}))}
							renderTrigger={(open, val) => (
								<button className="outlined neon lg w-full justify-between font-normal">
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
					<button type="reset" className="ghost col-span-1">
						{t("form.cancel")}
					</button>
					<button type="submit" className="col-span-2">
						{t("form.submit")}
					</button>
				</div>
			</form>
		</Dialog>
	);
}
