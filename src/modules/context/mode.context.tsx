import { createContext, use, useState, type PropsWithChildren } from "react";
import type { SlimMode } from "@/modules/keyboard/keyboard.schema";

function useModeHook() {
	const [mode, setMode] = useState<SlimMode>("normal");
	const [keys, setKeys] = useState<string[]>([]);
	return { mode, setMode, keys, setKeys };
}

const ModeContext = createContext<ReturnType<typeof useModeHook> | null>(null);

export function useModeContext() {
	const context = use(ModeContext);
	if (!context) throw new Error("useModeContext missing provider");
	return context;
}

export function ModeContextProvider({ children }: PropsWithChildren) {
	const value = useModeHook();
	return <ModeContext value={value}>{children}</ModeContext>;
}
