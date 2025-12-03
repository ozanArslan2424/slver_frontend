import { useMutation, useQuery } from "@tanstack/react-query";
import type { PersonData } from "@/modules/person/person.schema";
import { useModal } from "@/hooks/use-modal";
import { useAppContext } from "@/modules/context/app.context";
import { useModalContext } from "@/modules/context/modal.context";

export type UsePersonModuleReturn = ReturnType<typeof usePersonModule>;

export function usePersonModule() {
	const { setModal } = useModalContext();
	const { person, thing, group } = useAppContext();

	const listQuery = useQuery(group.queryPersonList());

	const assignMutation = useMutation(thing.assign(handleReset));
	const removeMutation = useMutation(group.remove(handleReset));

	const menuModal = useModal();
	const assignModal = useModal();
	const removeModal = useModal();

	function menuAction(entity?: PersonData) {
		if (entity) person.setActive(entity);
		menuModal.onOpenChange(true);
	}

	function removeAction(entity?: PersonData) {
		if (entity) person.setActive(entity);
		removeModal.onOpenChange(true);
	}

	function assignAction(entity?: PersonData) {
		if (entity) person.setActive(entity);
		menuModal.onOpenChange(true);
	}

	function removeConfirmAction(entity?: PersonData) {
		const active = person.active ?? entity;
		if (!active) return;
		const personId = active.id;
		removeMutation.mutate({ personId });
	}

	function removeCancelAction() {
		removeModal.onOpenChange(false);
	}

	function handleReset() {
		person.setActive(null);
		setModal(null);
	}

	return {
		active: person.active,
		listQuery,
		assignMutation,
		menuModal,
		assignModal,
		removeModal,
		menuAction,
		removeAction,
		removeConfirmAction,
		removeCancelAction,
		assignAction,
	};
}
