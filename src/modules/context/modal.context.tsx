import { useRangeContext } from "@/modules/context/range.context";
import { createContext, use, useCallback, useState, type PropsWithChildren } from "react";

function useModalHook() {
	const { setRange } = useRangeContext();
	const [modal, setModalState] = useState<string | null>(null);

	const setModal = useCallback(
		(value: string | null) => {
			console.log(`setModal called with ${value}`);
			setModalState(value);

			requestAnimationFrame(() => {
				if (value === null) {
					setRange(null);
				} else {
					const modalRange = document.getElementById(value);
					setRange(modalRange);
				}
			});
		},
		[setRange],
	);

	return { modal, setModal };
}

const ModalContext = createContext<ReturnType<typeof useModalHook> | null>(null);

export function useModalContext() {
	const context = use(ModalContext);
	if (!context) throw new Error("useModalContext missing provider");
	return context;
}

export function ModalContextProvider({ children }: PropsWithChildren) {
	const value = useModalHook();
	return <ModalContext value={value}>{children}</ModalContext>;
}
