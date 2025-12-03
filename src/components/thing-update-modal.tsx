import { Dialog } from "@/components/modals/dialog";
import { Combobox } from "@/components/form/combobox";
import { DatePicker } from "@/components/form/date-picker";
import { FormField } from "@/components/form/form-field";
import type { UsePersonModuleReturn } from "@/modules/person/use-person-module";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { CalendarPlusIcon, ChevronDownIcon } from "lucide-react";
import { PersonAvatar } from "@/components/ui/person-avatar";
import { cn, prefixId } from "@/lib/utils";
import { useLanguage } from "@/modules/language/use-language";
import type { UseKeyboardModuleReturn } from "@/modules/keyboard/use-keyboard-module";

type ThingUpdateModalProps = {
	thingModule: UseThingModuleReturn;
	personModule: UsePersonModuleReturn;
	keyboardModule: UseKeyboardModuleReturn;
};

export function ThingUpdateModal({
	thingModule,
	personModule,
	keyboardModule,
}: ThingUpdateModalProps) {
	const { t, timestamp } = useLanguage("thing");
	const thing = thingModule.active;
	const modal = thingModule.updateModal;
	const form = thingModule.updateForm;
	const mutation = thingModule.updateMutation;
	const isPending = mutation.isPending;
	const contentId = prefixId("content", "thing_update_modal");
	const dueDateId = prefixId("dueDate", "thing_update_modal");
	const assignedToIdId = prefixId("assignedToId", "thing_update_modal");

	function handleRetry() {
		if (mutation.isError) {
			mutation.mutate(mutation.variables);
		}
	}

	if (!thing) return null;
	return (
		<Dialog {...modal} showTitle title={t("update.title")} description={t("update.description")}>
			<form {...form.methods} className="flex flex-col gap-3">
				<div className="flex flex-1 flex-col gap-3">
					<FormField form={form} name="content" id="content">
						<textarea
							placeholder={t("form.fields.title.label")}
							title={t("form.fields.title.title")}
							required
							className="min-h-40"
							disabled={isPending}
							{...keyboardModule.register(contentId)}
						/>
					</FormField>

					<FormField form={form} name="dueDate" id="dueDate">
						<DatePicker
							startDate={new Date()}
							endDate={new Date(2040, 0, 1)}
							renderTrigger={(open, val) => (
								<button
									{...keyboardModule.register(dueDateId)}
									className="outlined neon lg w-full justify-between font-normal"
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

					<FormField form={form} name="assignedToId" id="assignedToId">
						<Combobox
							side="bottom"
							options={(personModule.listQuery.data ?? []).map((person) => ({
								label: person.name,
								value: person.id.toString(),
								...person,
							}))}
							renderTrigger={(open, val) => (
								<button
									{...keyboardModule.register(assignedToIdId)}
									className="outlined neon lg w-full justify-between font-normal"
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

				{mutation.isError && (
					<button
						type="button"
						onClick={handleRetry}
						className="unset rounded-md bg-rose-500/10 px-5 py-2 text-center text-sm font-semibold text-red-600 hover:bg-rose-500/5"
					>
						{t("retry.update")}
					</button>
				)}

				<div className="grid grid-cols-3 items-center gap-2">
					<button type="reset" className="ghost col-span-1" disabled={isPending}>
						{t("form.cancel")}
					</button>
					<button type="submit" className="col-span-2" disabled={isPending}>
						{t("form.submit")}
					</button>
				</div>
			</form>
		</Dialog>
	);
}
