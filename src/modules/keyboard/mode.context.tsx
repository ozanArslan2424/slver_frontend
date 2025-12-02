import {
	createContext,
	use,
	useMemo,
	useReducer,
	type ActionDispatch,
	type ReactNode,
} from "react";
import type { SlimMode } from "@/modules/keyboard/keyboard.schema";

type State = {
	mode: SlimMode;
	prevMode: SlimMode;
	keyBuffer: string[];
};

type Action =
	| { type: "setMode"; payload: SlimMode }
	| { type: "appendKey"; payload: string }
	| { type: "resetKeyBuffer" };

const defaultState: State = {
	mode: "normal",
	prevMode: "normal",
	keyBuffer: [],
};

const reducer = (prev: State, action: Action): State => {
	switch (action.type) {
		case "setMode":
			return { ...prev, mode: action.payload, prevMode: prev.mode };
		case "appendKey":
			return { ...prev, keyBuffer: [...prev.keyBuffer, action.payload] };
		case "resetKeyBuffer":
			return { ...prev, keyBuffer: [] };
		default:
			return prev;
	}
};

const ModeContext = createContext<State & { dispatch: ActionDispatch<[action: Action]> }>({
	...defaultState,
	dispatch: () => {},
});

export function useModeContext() {
	const context = use(ModeContext);
	if (!context) throw new Error("useModeContext missing provider");
	return context;
}

export function ModeProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(reducer, defaultState);
	const value = useMemo(() => ({ ...state, dispatch }), [state]);
	return <ModeContext value={value}>{children}</ModeContext>;
}
