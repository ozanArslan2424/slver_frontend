import {
	createContext,
	use,
	useState,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
} from "react";

const ModalContext = createContext<{
	modal: string | null;
	setModal: Dispatch<SetStateAction<string | null>>;
} | null>(null);

export function useModalContext() {
	const context = use(ModalContext);
	if (!context) throw new Error("useModalContext missing provider");
	return context;
}

export function ModalContextProvider({ children }: PropsWithChildren) {
	const [modal, setModal] = useState<string | null>(null);
	return <ModalContext value={{ modal, setModal }}>{children}</ModalContext>;
}
