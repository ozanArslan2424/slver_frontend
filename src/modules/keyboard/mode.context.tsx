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
	focusIndex: number;
};

type Action =
	| { type: "setMode"; payload: SlimMode }
	| { type: "appendKey"; payload: string }
	| { type: "resetKeyBuffer" }
	| { type: "increaseIndex"; payload: { total: number } }
	| { type: "decreaseIndex"; payload: { total: number } }
	| { type: "setIndex"; payload: number };

const defaultState: State = {
	mode: "normal",
	prevMode: "normal",
	keyBuffer: [],
	focusIndex: 0,
};

const reducer = (prev: State, action: Action): State => {
	switch (action.type) {
		case "setMode":
			return { ...prev, mode: action.payload, prevMode: prev.mode };
		case "appendKey":
			return { ...prev, keyBuffer: [...prev.keyBuffer, action.payload] };
		case "resetKeyBuffer":
			return { ...prev, keyBuffer: [] };
		case "increaseIndex":
			return {
				...prev,
				focusIndex: (prev.focusIndex + 1) % action.payload.total,
			};
		case "decreaseIndex":
			return {
				...prev,
				focusIndex: (prev.focusIndex - 1 + action.payload.total) % action.payload.total,
			};
		case "setIndex":
			return { ...prev, focusIndex: action.payload };
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
