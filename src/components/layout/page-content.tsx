import { CONFIG } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function PageContent({
	className,
	browserTitle = CONFIG.appTitle,
	children,
	...rest
}: ComponentProps<"div"> & { browserTitle?: string }) {
	return (
		<div
			className={cn(
				"mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6",
				className,
			)}
			{...rest}
		>
			<title>{browserTitle}</title>
			{children}
		</div>
	);
}
