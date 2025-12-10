import { Dialog } from "@/components/modals/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PersonAvatar } from "@/components/ui/person-avatar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/modules/language/use-language";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { CalendarCogIcon, CheckIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { ThingDetailLine } from "@/components/thing-detail-line";

type ThingDetailModalProps = {
	thingModule: UseThingModuleReturn;
	updateProps: ComponentProps<"button">;
	removeProps: ComponentProps<"button">;
	statusProps: ComponentProps<"button">;
	assignProps: ComponentProps<"button">;
};

export function ThingDetailModal({
	thingModule,
	updateProps,
	removeProps,
	statusProps,
	assignProps,
}: ThingDetailModalProps) {
	const { t, timestamp } = useLanguage("thing");

	const thing = thingModule.active;
	const handleOpenUpdateModal = thingModule.handleOpenUpdateModal;
	const handleOpenRemoveModal = thingModule.handleOpenRemoveModal;
	const handleOpenAssignModal = thingModule.handleOpenAssignModal;
	const handleUpdateStatus = thingModule.handleUpdateStatus;
	const modal = thingModule.detailModal;

	const iconSize = "size-5";

	if (!thing) return null;

	return (
		<Dialog
			{...modal}
			className="bg-card text-card-foreground"
			title={t("detail.title", { id: thing.id })}
			description={t("detail.description")}
		>
			<div className="flex flex-col gap-3 p-2">
				<ScrollArea className="max-h-[180px] sm:max-h-80">
					<p className="max-w-full pb-2 font-sans text-sm font-semibold wrap-break-word whitespace-pre-wrap sm:text-base">
						{thing.content}
					</p>
				</ScrollArea>

				<ThingDetailLine
					icon={
						<PersonAvatar
							person={thing.assignedTo ?? { image: undefined, name: "?" }}
							className="ring-border h-8.5 w-8.5 font-black ring"
						/>
					}
					label={
						thing.assignedTo
							? t("detail.assignedTo.somebody", { name: thing.assignedTo.name })
							: t("detail.assignedTo.nobody")
					}
				/>

				<ThingDetailLine
					squircle={<CalendarCogIcon className={iconSize} />}
					label={t("detail.createdAt", {
						date: timestamp(thing.createdAt).ordinalDateTime,
					})}
				/>

				{thing.dueDate && (
					<ThingDetailLine
						squircle="!!"
						className={thing.isDone ? "opacity-50" : ""}
						label={t(`detail.dueDate.${thing.isDone ? "done" : "notDone"}`, {
							date: timestamp(thing.dueDate).ordinalDate,
						})}
					/>
				)}

				{thing.isDone && thing.doneDate && (
					<ThingDetailLine
						squircle={<CheckIcon className={cn("text-emerald-500", iconSize)} />}
						label={t("detail.isDone", {
							date: timestamp(thing.doneDate).ordinalDateTime,
						})}
					/>
				)}

				<div className="grid grid-cols-2 gap-3">
					<button
						onClick={() => handleOpenUpdateModal(thing.id)}
						{...updateProps}
						className={cn("outlined h-9 w-full rounded-lg", updateProps.className)}
					>
						{t("detail.buttons.update")}
					</button>
					<button
						onClick={() => handleOpenAssignModal(thing.id)}
						{...assignProps}
						className={cn("outlined h-9 w-full rounded-lg", assignProps.className)}
					>
						{t("detail.buttons.assign")}
					</button>
					<button
						onClick={() => handleUpdateStatus(thing.id)}
						{...statusProps}
						className={cn("outlined h-9 w-full rounded-lg", statusProps.className)}
					>
						{t(`detail.buttons.${thing.isDone ? "markAsNotDone" : "markAsDone"}`)}
					</button>
					<button
						onClick={() => handleOpenRemoveModal(thing.id)}
						{...removeProps}
						className={cn("outlined h-9 w-full rounded-lg", removeProps.className)}
					>
						{t("detail.buttons.remove")}
					</button>
				</div>
			</div>
		</Dialog>
	);
}
