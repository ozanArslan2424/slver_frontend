import {
	createContext,
	use,
	useCallback,
	useRef,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from "react";
import { useState } from "react";
import type { KeyboardMode } from "@/modules/keyboard/keyboard.schema";

const ModeContext = createContext<{
	mode: KeyboardMode;
	setMode: (value: KeyboardMode) => void;
	currentFocusIndex: number;
	setCurrentFocusIndex: Dispatch<SetStateAction<number>>;
	keysBuffer: string[];
	setKeysBuffer: Dispatch<SetStateAction<string[]>>;
	getPreviousMode: () => KeyboardMode;
} | null>(null);

export function useModeContext() {
	const context = use(ModeContext);
	if (!context) throw new Error("useModeContext missing provider");
	return context;
}

export function ModeProvider({ children }: { children: ReactNode }) {
	const [mode, setModeState] = useState<KeyboardMode>("normal");
	const [keysBuffer, setKeysBuffer] = useState<string[]>([]);
	const [currentFocusIndex, setCurrentFocusIndex] = useState(0);

	const previousModeRef = useRef<KeyboardMode>("normal");

	const setMode = useCallback(
		(value: KeyboardMode) => {
			previousModeRef.current = mode;
			setModeState(value);
		},
		[mode],
	);

	const getPreviousMode = useCallback((): KeyboardMode => {
		return previousModeRef.current;
	}, []);

	return (
		<ModeContext.Provider
			value={{
				mode,
				setMode,
				keysBuffer,
				setKeysBuffer,
				currentFocusIndex,
				setCurrentFocusIndex,
				getPreviousMode,
			}}
		>
			{children}
		</ModeContext.Provider>
	);
}
