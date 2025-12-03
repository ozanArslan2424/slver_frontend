import { useModal } from "@/hooks/use-modal";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { ThingCreateSchema, type ThingData } from "@/modules/thing/thing.schema";
import { useLanguage } from "@/modules/language/use-language";
import { useForm } from "@/hooks/use-form";
import { useActionDialog } from "@/hooks/use-action-dialog";
import { useAppContext } from "@/modules/context/app.context";
import { useModalContext } from "@/modules/context/modal.context";

export type UseThingModuleReturn = ReturnType<typeof useThingModule>;

export function useThingModule() {
	const { setModal } = useModalContext();
	const { thing } = useAppContext();
	const { t } = useLanguage("thing");

	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const listQuery = useQuery(thing.queryList());

	const assignMutation = useMutation(thing.assign(handleReset));
	const statusMutation = useMutation(thing.done(handleReset));
	const removeMutation = useMutation(thing.remove(handleReset));
	const createMutation = useMutation(thing.create(handleReset));
	const updateMutation = useMutation(thing.update(handleReset));

	const updateModal = useModal();
	const detailModal = useModal();
	const assignModal = useModal();
	const removeModal = useModal();
	const menuModal = useActionDialog({
		actions: [
			{
				key: "detail",
				label: t("detail.label"),
				onSelect: () => detailOpenAction(),
			},
			...(thing.active?.isDone
				? [
						{
							key: "not-done",
							label: t("notDone.label"),
							onSelect: () => statusAction(),
						},
					]
				: [
						{
							key: "done",
							label: t("done.label"),
							onSelect: () => statusAction(),
						},
						{
							key: "update",
							label: t("update.label"),
							onSelect: () => updateAction(),
						},
						{
							key: "assign",
							label: t("assign.label"),
							onSelect: () => assignAction(),
						},
					]),
			{
				key: "remove",
				label: t("remove.label"),
				onSelect: () => removeAction(),
			},
		],
	});

	const createForm = useForm({
		schema: ThingCreateSchema,
		onSubmit: ({ values }) => {
			createMutation.mutate(values);
		},
	});

	const updateForm = useForm({
		schema: ThingCreateSchema,
		defaultValues: {
			content: thing.active?.content,
			dueDate: thing.active?.dueDate,
			assignedToId: thing.active?.assignedToId ?? undefined,
		},
		onSubmit: ({ values, defaultValues }) => {
			if (thing.active) {
				const isUpdated =
					values.content !== defaultValues?.content ||
					values.dueDate !== defaultValues?.dueDate ||
					values.assignedToId !== defaultValues?.assignedToId;

				if (isUpdated) {
					updateMutation.mutate({ thingId: thing.active.id, ...values });
				} else {
					handleReset();
				}
			} else {
				createMutation.mutate(values);
			}
		},
		onReset: () => {
			thing.setActive(null);
			updateModal.onOpenChange(false);
		},
	});

	function menuAction(entity?: ThingData) {
		if (entity) thing.setActive(entity);
		menuModal.onOpenChange(true);
	}

	function detailOpenAction(entity?: ThingData) {
		if (entity) thing.setActive(entity);
		detailModal.onOpenChange(true);
	}

	function detailCloseAction() {
		detailModal.onOpenChange(false);
	}

	function updateAction(entity?: ThingData) {
		if (entity) thing.setActive(entity);
		updateModal.onOpenChange(true);
	}

	function removeAction(entity?: ThingData) {
		if (entity) thing.setActive(entity);
		removeModal.onOpenChange(true);
	}

	function assignAction(entity?: ThingData) {
		if (entity) thing.setActive(entity);
		assignModal.onOpenChange(true);
	}

	function statusAction(entity?: ThingData, value?: boolean) {
		const active = thing.active ?? entity;
		if (!active) return;
		const thingId = active.id;
		const isDone = value !== undefined ? value : !active.isDone;
		statusMutation.mutate({ thingId, isDone });
	}

	function removeConfirmAction(entity?: ThingData) {
		const active = thing.active ?? entity;
		if (!active) return;
		const thingId = active.id;
		removeMutation.mutate({ thingId });
	}

	function removeCancelAction() {
		removeModal.onOpenChange(false);
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

	const formAction = () => textareaRef.current?.focus();

	return {
		find: thing.find,
		active: thing.active,
		listQuery,
		textareaRef,
		createMutation,
		updateMutation,
		assignMutation,
		statusMutation,
		removeMutation,
		createForm,
		updateForm,
		menuModal,
		updateModal,
		detailModal,
		removeModal,
		assignModal,
		handleSortByDate,
		menuAction,
		detailOpenAction,
		detailCloseAction,
		updateAction,
		assignAction,
		removeAction,
		statusAction,
		removeConfirmAction,
		removeCancelAction,
		formAction,
	};
}
