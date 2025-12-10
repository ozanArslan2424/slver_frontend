import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useModeContext } from "@/modules/context/mode.context";
import { useMemo } from "react";

export function AppFooter() {
	const isMobile = useIsMobile();
	const { mode, keys, index } = useModeContext();

	const modeColors = {
		normal: "bg-primary text-primary-foreground",
		visual: "bg-fuchsia-600 text-white",
		action: "bg-amber-600 text-white",
		insert: "bg-emerald-600 text-white",
		mobile: "bg-gray-600 text-gray-300",
	};

	const keysString = useMemo(() => {
		return keys
			.slice(-5)
			.map((code) => {
				// Remove "Key" prefix from letters
				if (code.startsWith("Key")) return code.slice(3).toLocaleLowerCase();

				// Remove "Digit" prefix from numbers
				if (code.startsWith("Digit")) return code.slice(5).toLocaleLowerCase();

				// Special cases
				const specialCases: Record<string, string> = {
					Space: "<space>",
					ShiftLeft: "<shift>",
					ShiftRight: "<shift>",
					ControlLeft: "<ctrl>",
					ControlRight: "<ctrl>",
					AltLeft: "<alt>",
					AltRight: "<alt>",
					MetaLeft: "<meta>",
					MetaRight: "<meta>",
					ArrowUp: "↑",
					ArrowDown: "↓",
					ArrowLeft: "←",
					ArrowRight: "→",
					Tab: "<tab>",
					Escape: "<escape>",
					Backspace: "<backspace>",
					CapsLock: "<caps>",
					Delete: "<del>",
					Insert: "<insert>",
					PageUp: "<pgup>",
					PageDown: "<pgdown>",
				};

				return specialCases[code] || code.toLocaleLowerCase();
			})
			.join("");
	}, [keys]);

	return (
		<footer className="bg-background fixed bottom-0 left-0 flex h-6 w-full max-w-[100vw] shrink-0 items-center justify-between border-y sm:h-8">
			<div className="flex items-center px-4 lg:px-12">
				<div
					className={cn(
						"inline-flex h-6 items-center justify-center border-y px-4 text-xs font-black uppercase select-none sm:h-8 sm:text-sm sm:font-semibold",
						modeColors[isMobile ? "mobile" : mode],
					)}
				>
					{isMobile ? "mobile" : mode}
				</div>
				<div className="text-secondary-foreground inline-flex h-8 max-w-[200px] items-center justify-end overflow-hidden border-y px-4 text-right font-mono text-sm whitespace-nowrap">
					{keysString}
				</div>
			</div>
			<div className="flex items-center px-4 lg:px-12">
				<span className="text-foreground/70 text-right font-mono text-xs whitespace-nowrap">
					{index}
				</span>
			</div>
		</footer>
	);
}
