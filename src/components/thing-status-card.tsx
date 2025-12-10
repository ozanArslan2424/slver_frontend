import type { UseDndReturn } from "@/hooks/use-dnd";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/modules/language/use-language";

type ThingStatusCardProps = {
	dnd: UseDndReturn;
	variant: "done" | "notDone";
	className?: string;
};

export function ThingStatusCard({ dnd, variant, className }: ThingStatusCardProps) {
	const { t } = useLanguage("thing");
	return (
		<div
			{...dnd.registerTarget({ targetId: variant })}
			className={cn(
				"card px-4 transition-all",
				"sticky top-12 z-50 sm:static sm:z-auto",
				dnd.getIsOver(variant)
					? "border-primary from-primary/10 to-primary/5 bg-linear-to-t py-8 opacity-100"
					: "border-border/70 bg-card/30 dark:bg-background py-4 opacity-90 sm:opacity-50",
				className,
			)}
		>
			<p className="pointer-events-none text-center text-sm font-semibold select-none">
				{t(`status.${variant}`)}
			</p>
		</div>
	);
}
