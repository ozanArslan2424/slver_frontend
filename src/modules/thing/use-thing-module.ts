import { useModal } from "@/hooks/use-modal";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
	ThingCreateSchema,
	type ThingAssignData,
	type ThingData,
} from "@/modules/thing/thing.schema";
import { useForm } from "@/hooks/use-form";
import { useAppContext } from "@/modules/context/app.context";
import { useModalContext } from "@/modules/context/modal.context";
import { Help } from "@/lib/help.namespace";

export type UseThingModuleReturn = ReturnType<typeof useThingModule>;

export function useThingModule() {
	const { setModal } = useModalContext();
	const { thing } = useAppContext();

	const listQuery = useQuery(thing.queryList());

	const assignMutation = useMutation(thing.assign(handleReset));
	const statusMutation = useMutation(thing.done(handleReset));
	const removeMutation = useMutation(thing.remove(handleReset));
	const createMutation = useMutation(
		thing.create(handleReset, (err) => createForm.setRootError(err.message)),
	);
	const updateMutation = useMutation(
		thing.update(handleReset, (err) => updateForm.setRootError(err.message)),
	);

	const updateModal = useModal();
	const detailModal = useModal();
	const assignModal = useModal();
	const removeModal = useModal();
	const menuModal = useModal();

	const createForm = useForm({
		schema: ThingCreateSchema,
		mutation: createMutation,
		onSubmit: ({ values }) => {
			createMutation.mutate(values);
		},
	});

	const updateForm = useForm({
		schema: ThingCreateSchema,
		mutation: updateMutation,
		defaultValues: {
			content: thing.active?.content,
			dueDate: thing.active?.dueDate,
			assignedToId: thing.active?.assignedToId ?? undefined,
		},
		onSubmit: ({ values }) => {
			Help.assert(thing.active?.id, "thing.active.id is not defined");
			updateMutation.mutate({ thingId: thing.active.id, ...values });
		},
		onReset: handleReset,
	});

	function handleOpenMenuModal(id: ThingData["id"]) {
		const entity = thing.find(id);
		if (entity) thing.setActive(entity);
		menuModal.onOpenChange(true);
	}

	function handleOpenDetailModal(id: ThingData["id"]) {
		const entity = thing.find(id);
		if (entity) thing.setActive(entity);
		detailModal.onOpenChange(true);
	}

	function handleOpenUpdateModal(id: ThingData["id"]) {
		const entity = thing.find(id);
		if (entity) thing.setActive(entity);
		updateModal.onOpenChange(true);
	}

	function handleOpenRemoveModal(id: ThingData["id"]) {
		const entity = thing.find(id);
		if (entity) thing.setActive(entity);
		removeModal.onOpenChange(true);
	}

	function handleOpenAssignModal(id: ThingData["id"]) {
		const entity = thing.find(id);
		if (entity) thing.setActive(entity);
		assignModal.onOpenChange(true);
	}

	function handleUpdateStatus(id?: ThingData["id"], value?: boolean) {
		const active = id ? thing.find(id) : thing.active;
		if (!active) return;
		const thingId = active.id;
		const isDone = value !== undefined ? value : !active.isDone;
		statusMutation.mutate({ thingId, isDone });
	}

	function handleRemove(id?: ThingData["id"]) {
		const active = id ? thing.find(id) : thing.active;
		if (!active) return;
		const thingId = active.id;
		removeMutation.mutate({ thingId });
	}

	function handleAssign(value: ThingAssignData) {
		assignMutation.mutate(value);
	}

	function handleReset() {
		thing.setActive(null);
		createForm.reset();
		updateForm.reset();
		setModal(null);
	}

	function handleSortByDate(a: ThingData, b: ThingData) {
		const getTime = (input: string) => new Date(input).getTime();
		if (!!a.doneDate && !!b.doneDate) {
			return getTime(b.doneDate) - getTime(a.doneDate);
		} else {
			return getTime(b.createdAt) - getTime(a.createdAt);
		}
	}

	return {
		find: thing.find,
		active: thing.active,
		listQuery,
		createForm,
		updateForm,
		menuModal,
		updateModal,
		detailModal,
		removeModal,
		assignModal,
		handleSortByDate,
		handleOpenMenuModal,
		handleOpenDetailModal,
		handleOpenUpdateModal,
		handleOpenAssignModal,
		handleOpenRemoveModal,
		handleUpdateStatus,
		handleRemove,
		handleAssign,
	};
}
