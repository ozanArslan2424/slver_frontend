import { Dialog } from "@/components/modals/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PersonAvatar } from "@/components/ui/person-avatar";
import { cn, prefixId } from "@/lib/utils";
import type { UseKeyboardModuleReturn } from "@/modules/keyboard/use-keyboard-module";
import { useLanguage } from "@/modules/language/use-language";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { CalendarCogIcon, CheckIcon } from "lucide-react";
import type { ReactNode } from "react";

type ThingDetailModalProps = {
	thingModule: UseThingModuleReturn;
	keyboardModule: UseKeyboardModuleReturn;
};

function ThingInfoLine({
	icon,
	squircle,
	label,
	className,
}: {
	icon?: ReactNode;
	squircle?: ReactNode;
	label: string;
	className?: string;
}) {
	return (
		<div className={cn("flex items-center gap-2 sm:gap-3", className)}>
			{squircle ? (
				<div className="squircle bg-card text-card-foreground ring-border h-8.5 w-8.5 ring">
					{squircle}
				</div>
			) : (
				icon
			)}
			<p className="text-sm font-bold wrap-break-word sm:text-base">{label}</p>
		</div>
	);
}

export function ThingDetailModal({ thingModule, keyboardModule }: ThingDetailModalProps) {
	const { t, timestamp } = useLanguage("thing");

	const thing = thingModule.active;
	const updateAction = thingModule.updateAction;
	const removeAction = thingModule.removeAction;
	const modal = thingModule.detailModal;
	const updateButtonId = prefixId("update", "thing_detail");
	const removeButtonId = prefixId("remove", "thing_detail");

	const iconSize = "size-5";

	if (!thing) return null;

	return (
		<Dialog
			{...modal}
			className="bg-card text-card-foreground"
			title={t("detail.fields.title", { id: thing.id })}
			description={t("detail.fields.description")}
		>
			<div className="flex flex-col gap-3 p-2">
				<ScrollArea className="max-h-[180px] sm:max-h-80">
					<p className="max-w-full pb-2 font-sans text-sm font-semibold wrap-break-word whitespace-pre-wrap sm:text-base">
						{thing.content}
					</p>
				</ScrollArea>

				<ThingInfoLine
					icon={
						<PersonAvatar
							person={thing.assignedTo ?? { image: undefined, name: "?" }}
							className="ring-border h-8.5 w-8.5 font-black ring"
						/>
					}
					label={
						thing.assignedTo
							? t("detail.fields.assignedTo.somebody", { name: thing.assignedTo.name })
							: t("detail.fields.assignedTo.nobody")
					}
				/>

				<ThingInfoLine
					squircle={<CalendarCogIcon className={iconSize} />}
					label={t("detail.fields.createdAt.label", {
						date: timestamp(thing.createdAt).ordinalDateTime,
					})}
				/>

				{thing.dueDate && (
					<ThingInfoLine
						squircle="!!"
						className={thing.isDone ? "opacity-50" : ""}
						label={t(`detail.fields.dueDate.${thing.isDone ? "labelDone" : "labelNotDone"}`, {
							date: timestamp(thing.dueDate).ordinalDate,
						})}
					/>
				)}

				{thing.isDone && thing.doneDate && (
					<ThingInfoLine
						squircle={<CheckIcon className={cn("text-emerald-500", iconSize)} />}
						label={t("detail.fields.isDone.label", {
							date: timestamp(thing.doneDate).ordinalDateTime,
						})}
					/>
				)}

				<div className="flex items-center gap-3">
					{!thing.isDone && (
						<button
							onClick={() => updateAction(thing)}
							className={cn(
								"outlined h-9 w-full rounded-lg",
								"data-[focus=true]:ring-primary ring ring-transparent",
							)}
							{...keyboardModule.register(updateButtonId)}
						>
							{t("update.label")}
						</button>
					)}
					<button
						onClick={() => removeAction(thing)}
						className={cn(
							"outlined h-9 w-full rounded-lg",
							"data-[focus=true]:ring-primary ring ring-transparent",
						)}
						{...keyboardModule.register(removeButtonId)}
					>
						{t("remove.label")}
					</button>
				</div>
			</div>
		</Dialog>
	);
}
