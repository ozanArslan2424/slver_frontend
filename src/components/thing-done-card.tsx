import type { UseDndReturn } from "@/hooks/use-dnd";
import { cn } from "@/lib/utils";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";

type ThingDoneCardProps = {
	thingModule: UseThingModuleReturn;
	dnd: UseDndReturn;
	variant: "done" | "notDone";
};

export function ThingDoneCard({ thingModule, dnd, variant }: ThingDoneCardProps) {
	return (
		<div
			{...dnd.registerTarget({ targetId: variant })}
			className={cn(
				"card hidden px-4 transition-all sm:block",
				dnd.getIsOver(variant)
					? "border-primary from-primary/10 to-primary/5 bg-linear-to-t py-8 opacity-100"
					: "border-border/70 bg-card/30 dark:bg-background py-4 opacity-50",
			)}
		>
			<p className="text-center text-sm font-semibold select-none">
				{thingModule.t(`${variant}.description`)}
			</p>
		</div>
	);
}
