import { useMutation, useQuery } from "@tanstack/react-query";
import type { PersonData } from "@/modules/person/person.schema";
import { useModal } from "@/hooks/use-modal";
import { useAppContext } from "@/modules/context/app.context";
import { useModalContext } from "@/modules/context/modal.context";

export type UsePersonModuleReturn = ReturnType<typeof usePersonModule>;

export function usePersonModule() {
	const { setModal } = useModalContext();
	const { person, group } = useAppContext();

	const listQuery = useQuery(group.queryPersonList());

	const removeMutation = useMutation(group.remove(handleReset));

	const detailModal = useModal();
	const assignModal = useModal();
	const removeModal = useModal();

	function handleOpenDetailModal(id: PersonData["id"]) {
		const entity = person.find(id);
		if (entity) person.setActive(entity);
		detailModal.onOpenChange(true);
	}

	function handleOpenRemoveModal(id: PersonData["id"]) {
		const entity = person.find(id);
		if (entity) person.setActive(entity);
		removeModal.onOpenChange(true);
	}

	function handleOpenAssignModal(id: PersonData["id"]) {
		const entity = person.find(id);
		if (entity) person.setActive(entity);
		assignModal.onOpenChange(true);
	}

	function handleRemove(id?: PersonData["id"]) {
		const active = id ? person.find(id) : person.active;
		if (!active) return;
		const personId = active.id;
		removeMutation.mutate({ personId });
	}

	function handleReset() {
		person.setActive(null);
		setModal(null);
	}

	return {
		active: person.active,
		listQuery,
		detailModal,
		assignModal,
		removeModal,
		handleOpenDetailModal,
		handleOpenRemoveModal,
		handleRemove,
		handleOpenAssignModal,
	};
}
