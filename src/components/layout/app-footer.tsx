import { cn } from "@/lib/utils";
import { useModeContext } from "@/modules/keyboard/mode.context";

export function AppFooter() {
	const { mode, keysBuffer } = useModeContext();

	const modeColors = {
		normal: "bg-primary text-primary-foreground",
		visual: "bg-fuchsia-600 text-white",
		action: "bg-amber-600 text-white",
		insert: "bg-emerald-600 text-white",
	};

	function getKeyLabel(code: string) {
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
			Escape: "<escape>",
			Backspace: "<backspace>",
			CapsLock: "<caps>",
			Delete: "<del>",
			Insert: "<insert>",
			PageUp: "<pgup>",
			PageDown: "<pgdown>",
		};

		return specialCases[code] || code.toLocaleLowerCase();
	}

	return (
		<footer className="fixed bottom-0 left-0 flex h-8 w-full shrink-0 items-center justify-between border-y">
			<div className="flex items-center px-4 lg:px-12">
				<div
					className={cn(
						"inline-flex h-8 items-center justify-center border-y px-4 text-sm font-semibold uppercase select-none",
						modeColors[mode],
					)}
				>
					{mode}
				</div>
				<div className="text-secondary-foreground inline-flex h-8 max-w-[200px] items-center justify-end overflow-hidden border-y px-4 text-right font-mono text-sm whitespace-nowrap">
					{keysBuffer
						.slice(-5)
						.map((k) => getKeyLabel(k))
						.join("")}
				</div>
			</div>
			<div className="flex items-center px-4 lg:px-12">
				<span className="text-foreground/70 text-right font-mono text-xs whitespace-nowrap"></span>
			</div>
		</footer>
	);
}
