import { Dialog } from "@/components/modals/dialog";
import { OverflowBox } from "@/components/overflow-box";
import { PersonAvatar } from "@/components/ui/person-avatar";
import { cn, prefixId } from "@/lib/utils";
import type { UseKeyboardModuleReturn } from "@/modules/keyboard/use-keyboard-module";
import { useLanguage } from "@/modules/language/use-language";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { CalendarCogIcon, CheckIcon } from "lucide-react";
import type { ReactNode } from "react";

type ThingDetailDialogProps = {
	thingModule: UseThingModuleReturn;
	keyboardModule: UseKeyboardModuleReturn;
};

function ThingInfoLine({
	icon,
	label,
	className,
}: {
	icon: ReactNode;
	label: string;
	className?: string;
}) {
	return (
		<div className={cn("flex items-center gap-2 sm:gap-3", className)}>
			{icon}
			<p className="text-sm font-bold wrap-break-word sm:text-base">{label}</p>
		</div>
	);
}

export function ThingDetailDialog({ thingModule, keyboardModule }: ThingDetailDialogProps) {
	const { t, timestamp } = useLanguage("thing");

	const thing = thingModule.active;
	const handleUpdateClick = thingModule.handleUpdateClick;
	const handleRemoveClick = thingModule.handleRemoveClick;
	const dialog = thingModule.detailDialog;
	const closeButtonId = prefixId("close", "thing_detail");
	const updateButtonId = prefixId("update", "thing_detail");
	const removeButtonId = prefixId("remove", "thing_detail");

	const iconSize = "size-5";
	const squircleSize = "size-8.5";

	if (!thing) return null;

	return (
		<Dialog
			{...dialog}
			className="bg-card text-card-foreground"
			title={t("detail.fields.title", { id: thing.id })}
			description={t("detail.fields.description")}
			closeButtonProps={{
				className: cn(
					"outline-2 outline-offset-2 outline-transparent",
					keyboardModule.getIsFocused(closeButtonId) && "outline-ring",
				),
				...keyboardModule.register(closeButtonId),
			}}
		>
			<div className="flex flex-col gap-3 p-2">
				<OverflowBox maxHeight="sm:max-h-[320px] max-h-[180px]">
					<p className="max-w-full pb-2 font-sans text-sm font-semibold wrap-break-word whitespace-pre-wrap sm:text-base">
						{thing.content}
					</p>
				</OverflowBox>

				<ThingInfoLine
					icon={
						<PersonAvatar
							person={thing.assignedTo ?? { image: undefined, name: "?" }}
							className={cn("ring-border font-black ring", squircleSize)}
						/>
					}
					label={
						thing.assignedTo
							? t("detail.fields.assignedTo.somebody", { name: thing.assignedTo.name })
							: t("detail.fields.assignedTo.nobody")
					}
				/>

				<ThingInfoLine
					icon={
						<div
							className={cn("squircle bg-card text-card-foreground ring-border ring", squircleSize)}
						>
							<CalendarCogIcon className={iconSize} />
						</div>
					}
					label={t("detail.fields.createdAt.label", {
						date: timestamp(thing.createdAt).ordinalDateTime,
					})}
				/>

				{thing.dueDate && (
					<ThingInfoLine
						className={thing.isDone ? "opacity-50" : ""}
						icon={
							<div
								className={cn(
									"squircle bg-card text-card-foreground ring-border ring",
									squircleSize,
								)}
							>
								!!
							</div>
						}
						label={t(`detail.fields.dueDate.${thing.isDone ? "labelDone" : "labelNotDone"}`, {
							date: timestamp(thing.dueDate).ordinalDate,
						})}
					/>
				)}

				{thing.isDone && thing.doneDate && (
					<ThingInfoLine
						icon={
							<div
								className={cn(
									"squircle bg-card text-card-foreground ring-border ring",
									squircleSize,
								)}
							>
								<CheckIcon className={cn("text-emerald-500", iconSize)} />
							</div>
						}
						label={t("detail.fields.isDone.label", {
							date: timestamp(thing.doneDate).ordinalDateTime,
						})}
					/>
				)}

				<div className="flex items-center gap-3">
					{!thing.isDone && (
						<button
							onClick={() => handleUpdateClick(thing)}
							className={cn(
								"outlined h-9 w-full rounded-lg",
								"outline-2 outline-offset-2 outline-transparent",
								keyboardModule.getIsFocused(updateButtonId) && "outline-ring",
							)}
							{...keyboardModule.register(updateButtonId)}
						>
							{t("update.label")}
						</button>
					)}
					<button
						onClick={() => handleRemoveClick(thing)}
						className={cn(
							"outlined h-9 w-full rounded-lg",
							"outline-2 outline-offset-2 outline-transparent",
							keyboardModule.getIsFocused(removeButtonId) && "outline-ring",
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
