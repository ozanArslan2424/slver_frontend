import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ThingDetailLineProps = {
	icon?: ReactNode;
	squircle?: ReactNode;
	label: string;
	className?: string;
};

export function ThingDetailLine({ icon, squircle, label, className }: ThingDetailLineProps) {
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
