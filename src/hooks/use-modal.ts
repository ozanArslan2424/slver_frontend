import { prefixId } from "@/lib/utils";
import { useModalContext } from "@/modules/context/modal.context";
import { useCallback, useId, useMemo, useRef } from "react";

export type ModalState = ReturnType<typeof useModal>;

export function useModal() {
	const { modal, setModal } = useModalContext();
	const generatedId = useId();
	const id = prefixId(generatedId, "modal");
	const ref = useRef<HTMLDivElement | null>(null);

	const open = useMemo(() => modal === id, [id, modal]);

	const onOpenChange = useCallback(
		(bool: boolean) => {
			setModal(bool ? id : null);
		},
		[id, setModal],
	);

	return { id, ref, open, onOpenChange };
}
