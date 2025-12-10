import { motion } from "motion/react";
import type { ReactNode } from "react";

export function LandingMotionContainer({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<motion.div
			variants={{
				hidden: { opacity: 0 },
				visible: {
					opacity: 1,
					transition: {
						staggerChildren: 0.2,
						delayChildren: 0.3,
					},
				},
			}}
			initial="hidden"
			animate="visible"
			className={className}
		>
			{children}
		</motion.div>
	);
}
