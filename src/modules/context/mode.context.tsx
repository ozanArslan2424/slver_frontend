import {
	createContext,
	use,
	useState,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
} from "react";
import type { SlimMode } from "@/modules/keyboard/keyboard.schema";

const ModeContext = createContext<{
	mode: SlimMode;
	setMode: Dispatch<SetStateAction<SlimMode>>;
	keys: string[];
	setKeys: Dispatch<SetStateAction<string[]>>;
} | null>(null);

export function useModeContext() {
	const context = use(ModeContext);
	if (!context) throw new Error("useModeContext missing provider");
	return context;
}

export function ModeContextProvider({ children }: PropsWithChildren) {
	const [mode, setMode] = useState<SlimMode>("normal");
	const [keys, setKeys] = useState<string[]>([]);
	return <ModeContext value={{ mode, setMode, keys, setKeys }}>{children}</ModeContext>;
}
