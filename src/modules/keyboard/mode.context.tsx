import { createContext, use, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useState } from "react";
import type { KeyboardMode } from "@/modules/keyboard/keyboard.schema";

const ModeContext = createContext<{
	mode: KeyboardMode;
	setMode: Dispatch<SetStateAction<KeyboardMode>>;
	currentFocusIndex: number;
	setCurrentFocusIndex: Dispatch<SetStateAction<number>>;
	keysBuffer: string[];
	setKeysBuffer: Dispatch<SetStateAction<string[]>>;
} | null>(null);

export function useModeContext() {
	const context = use(ModeContext);
	if (!context) throw new Error("useModeContext missing provider");
	return context;
}

export function ModeProvider({ children }: { children: ReactNode }) {
	const [mode, setMode] = useState<KeyboardMode>("normal");
	const [keysBuffer, setKeysBuffer] = useState<string[]>([]);
	const [currentFocusIndex, setCurrentFocusIndex] = useState(0);

	return (
		<ModeContext
			value={{
				mode,
				setMode,
				keysBuffer,
				setKeysBuffer,
				currentFocusIndex,
				setCurrentFocusIndex,
			}}
		>
			{children}
		</ModeContext>
	);
}
