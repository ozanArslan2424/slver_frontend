import { Dialog } from "@/components/ui/dialog";
import { PersonAvatar } from "@/components/ui/person-avatar";
import { cn, prefixId } from "@/lib/utils";
import type { UseKeyboardModuleReturn } from "@/modules/keyboard/use-keyboard-module";
import { useLanguage } from "@/modules/language/use-language";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { CalendarCogIcon, CheckIcon } from "lucide-react";

type ThingDetailDialogProps = {
	thingModule: UseThingModuleReturn;
	keyboardModule: UseKeyboardModuleReturn;
};

export function ThingDetailDialog({ thingModule, keyboardModule }: ThingDetailDialogProps) {
	const { t, timestamp } = useLanguage("thing");

	const thing = thingModule.active;
	const handleUpdateClick = thingModule.handleUpdateClick;
	const handleRemoveClick = thingModule.handleRemoveClick;
	const dialog = thingModule.detailDialog;
	const iconSize = "size-5";
	const squircleSize = "size-8.5";
	const closeButtonId = prefixId("close", "detail");
	const updateButtonId = prefixId("update", "detail");
	const removeButtonId = prefixId("remove", "detail");

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
				...keyboardModule.getElementProps(closeButtonId),
			}}
		>
			<div className="flex flex-col gap-3 p-2">
				<pre className="text-foreground bg-muted/10 max-w-full overflow-auto rounded-md px-1 pb-4 font-sans font-semibold wrap-break-word whitespace-pre-wrap">
					{thing.content}
				</pre>

				<div className="flex items-center gap-4">
					<PersonAvatar
						person={thing.assignedTo ?? { image: undefined, name: "?" }}
						className={cn("ring-border font-black ring", squircleSize)}
					/>

					<p className="text-foreground leading-0 font-bold">
						{thing.assignedTo
							? t("detail.fields.assignedTo.somebody", {
									name: thing.assignedTo.name,
								})
							: t("detail.fields.assignedTo.nobody")}
					</p>
				</div>

				{/* <div className="flex items-center gap-4">
						<div
							className={cn("squircle bg-card text-card-foreground ring-border ring", circleSize)}
						>
							{t("detail.fields.id.label")}
						</div>
						<p className="text-foreground leading-0 font-bold">{thing.id}</p>
					</div> */}

				<div className="flex items-center gap-4">
					<div
						className={cn("squircle bg-card text-card-foreground ring-border ring", squircleSize)}
					>
						<CalendarCogIcon className={iconSize} />
					</div>
					<p className="text-foreground leading-0 font-bold">
						{t("detail.fields.createdAt.label", {
							date: timestamp(thing.createdAt).ordinalDateTime,
						})}
					</p>
				</div>

				{thing.dueDate && (
					<div className={cn("flex items-center gap-4", thing.isDone && "opacity-50")}>
						<div
							className={cn("squircle bg-card text-card-foreground ring-border ring", squircleSize)}
						>
							!!
						</div>
						<p className="text-foreground leading-0 font-bold">
							{t(`detail.fields.dueDate.${thing.isDone ? "labelDone" : "labelNotDone"}`, {
								date: timestamp(thing.dueDate).ordinalDate,
							})}
						</p>
					</div>
				)}

				{thing.isDone && thing.doneDate && (
					<div className="flex items-center gap-4">
						<div
							className={cn("squircle bg-card text-card-foreground ring-border ring", squircleSize)}
						>
							<CheckIcon className={cn("text-emerald-500", iconSize)} />
						</div>
						<p className="text-foreground leading-0 font-bold">
							{t("detail.fields.isDone.label", {
								date: timestamp(thing.doneDate).ordinalDateTime,
							})}
						</p>
					</div>
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
							{...keyboardModule.getElementProps(updateButtonId)}
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
						{...keyboardModule.getElementProps(removeButtonId)}
					>
						{t("remove.label")}
					</button>
				</div>
			</div>
		</Dialog>
	);
}
