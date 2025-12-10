import { createContext, use, useCallback, useState, type PropsWithChildren } from "react";

function useRangeHook() {
	const [range, setRangeState] = useState<HTMLElement>(document.documentElement);
	const setRange = useCallback((value: HTMLElement | null) => {
		setRangeState(value ?? document.documentElement);
	}, []);
	return { range, setRange };
}

const RangeContext = createContext<ReturnType<typeof useRangeHook> | null>(null);

export function useRangeContext() {
	const context = use(RangeContext);
	if (!context) throw new Error("useRangeContext missing provider");
	return context;
}

export function RangeContextProvider({ children }: PropsWithChildren) {
	const value = useRangeHook();
	return <RangeContext value={value}>{children}</RangeContext>;
}
