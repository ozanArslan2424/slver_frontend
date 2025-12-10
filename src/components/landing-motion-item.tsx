import { motion } from "motion/react";
import type { ReactNode } from "react";

export function LandingMotionItem({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<motion.div
			variants={{
				hidden: {
					opacity: 0,
					y: 40,
				},
				visible: {
					opacity: 1,
					y: 0,
					transition: {
						duration: 0.5,
						ease: "easeOut",
					},
				},
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}
