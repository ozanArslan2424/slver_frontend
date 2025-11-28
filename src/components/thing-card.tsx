import { PersonAvatar } from "@/components/ui/person-avatar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/modules/language/use-language";
import type { ThingData } from "@/modules/thing/thing.schema";
import type { ComponentProps } from "react";

type ThingCardProps = ComponentProps<"div"> & {
	thing: ThingData;
};

export function ThingCard({ thing, className, ...rest }: ThingCardProps) {
	const { t, timestamp } = useLanguage("thing");

	return (
		<div
			className={cn(
				"card",
				"flex min-h-18 flex-col gap-3 p-3",
				"border-card relative min-h-18 cursor-pointer outline-2 outline-offset-2 outline-transparent transition-all",
				thing._placeholder === true ? "opacity-30" : "animate_down",
				className,
			)}
			{...rest}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-1 flex-col">
					<p className="flex-1 pb-2 text-sm font-semibold">{thing.content}</p>

					<p className="text-foreground/70 text-xs">
						{thing.assignedTo
							? t("detail.fields.assignedTo.somebody", {
									name: thing.assignedTo.name,
								})
							: t("detail.fields.assignedTo.nobody")}{" "}
						{thing.dueDate &&
							t(`detail.fields.dueDate.${thing.isDone ? "labelDone" : "labelNotDone"}`, {
								date: timestamp(thing.dueDate).fromNow,
							})}
					</p>
				</div>

				<div>
					<PersonAvatar
						person={thing.assignedTo ?? { image: undefined, name: "?" }}
						className="ring-border size-12 font-black ring"
					/>
				</div>
			</div>
		</div>
	);
}
