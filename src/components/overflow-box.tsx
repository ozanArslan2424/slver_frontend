import { cn } from "@/lib/utils";
import { useRef, useState, useEffect, type ReactNode } from "react";

export function OverflowBox({
	children,
	maxHeight = "max-h-64",
	gradient = "from-card via-card/80",
}: {
	children: ReactNode;
	maxHeight?: string;
	gradient?: string;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isOverflowing, setIsOverflowing] = useState(false);

	useEffect(() => {
		const checkOverflow = () => {
			const container = containerRef.current;
			if (container) {
				setIsOverflowing(container.scrollHeight > container.clientHeight);
			}
		};

		checkOverflow();
		const observer = new ResizeObserver(checkOverflow);
		if (containerRef.current) observer.observe(containerRef.current);

		return () => observer.disconnect();
	}, []);

	return (
		<div ref={containerRef} className={cn("relative overflow-y-auto", maxHeight)}>
			{children}
			{isOverflowing && (
				<div
					className={cn(
						"pointer-events-none sticky right-0 -bottom-2 left-0 h-12 bg-linear-to-t to-transparent",
						gradient,
					)}
				/>
			)}
		</div>
	);
}
