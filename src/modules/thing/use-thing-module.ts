import { useAppContext } from "@/app";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { useDialog } from "@/hooks/use-dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";
import { ThingCreateSchema, type ThingData } from "@/modules/thing/thing.schema";
import { useLanguage } from "@/modules/language/use-language";
import { prefixId } from "@/lib/utils";
import { useForm } from "@/hooks/use-form";
import type { KeyboardElement } from "@/modules/keyboard/keyboard.schema";
import { useActionDialog } from "@/hooks/use-action-dialog";

export type UseThingModuleReturn = ReturnType<typeof useThingModule>;

export function useThingModule() {
	const { thing } = useAppContext();
	const { t } = useLanguage("thing");

	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const listQuery = useQuery(thing.queryList());

	const assignMutation = useMutation(thing.assign(handleReset));
	const doneMutation = useMutation(thing.done(handleReset));
	const removeMutation = useMutation(thing.remove(handleReset));
	const createMutation = useMutation(thing.create(handleReset));
	const updateMutation = useMutation(thing.update(handleReset));

	const updateDialog = useDialog();
	const detailDialog = useDialog();
	const assignDialog = useActionDialog({
		actions: [],
		title: t("assign.label"),
		description: t("assign.label"),
	});
	const removeDialog = useConfirmDialog({
		title: t("remove.confirm.title"),
		description: t("remove.confirm.description"),
		onConfirm: () => {
			if (!thing.active) {
				toast.error(t("remove.confirm.error"));
				return;
			}
			removeMutation.mutate({ thingId: thing.active.id });
		},
	});
	const actionDialog = useActionDialog({
		actions: [
			{
				key: "detail",
				label: t("detail.label"),
				onSelect: () => handleDetailClick(),
			},
			...(thing.active?.isDone
				? [
						{
							key: "not-done",
							label: t("notDone.label"),
							onSelect: () => handleNotDoneClick(),
						},
					]
				: [
						{
							key: "done",
							label: t("done.label"),
							onSelect: () => handleDoneClick(),
						},
						{
							key: "update",
							label: t("update.label"),
							onSelect: () => handleUpdateClick(),
						},
						{
							key: "assign",
							label: t("assign.label"),
							onSelect: () => handleAssignClick(),
						},
					]),
			{
				key: "remove",
				label: t("remove.label"),
				onSelect: () => handleRemoveClick(),
			},
		],
	});

	const createForm = useForm({
		schema: ThingCreateSchema,
		onSubmit: (body) => {
			createMutation.mutate(body);
		},
	});

	const defaultValues = useMemo(
		() =>
			thing.active
				? {
						content: thing.active.content,
						dueDate: thing.active.dueDate,
						assignedToId: thing.active.assignedToId ?? undefined,
					}
				: {
						content: "",
						dueDate: undefined,
						assignedToId: undefined,
					},
		[thing.active],
	);

	const updateForm = useForm({
		schema: ThingCreateSchema,
		defaultValues,
		onSubmit: (body) => {
			if (thing.active) {
				const isUpdated =
					body.content !== defaultValues.content ||
					body.dueDate !== defaultValues.dueDate ||
					body.assignedToId !== defaultValues.assignedToId;

				if (isUpdated) {
					updateMutation.mutate({ thingId: thing.active.id, ...body });
				} else {
					handleReset();
				}
			} else {
				createMutation.mutate(body);
			}
		},
		onReset: () => {
			thing.setActive(null);
			updateDialog.onOpenChange(false);
		},
	});

	const handleActionClick = useCallback(
		(entity: ThingData) => {
			thing.setActive(entity);
			actionDialog.onOpenChange(true);
		},
		[actionDialog, thing],
	);

	const handleDetailClick = useCallback(
		(entity?: ThingData) => {
			if (entity) {
				thing.setActive(entity);
			}
			detailDialog.onOpenChange(true);
		},
		[detailDialog, thing],
	);

	const handleUpdateClick = useCallback(
		(entity?: ThingData) => {
			if (entity) {
				thing.setActive(entity);
			}
			updateDialog.onOpenChange(true);
		},
		[updateDialog, thing],
	);

	const handleRemoveClick = useCallback(
		(entity?: ThingData) => {
			if (entity) {
				thing.setActive(entity);
			}
			removeDialog.onOpenChange(true);
		},
		[removeDialog, thing],
	);

	const handleAssignClick = useCallback(
		(entity?: ThingData) => {
			if (entity) {
				thing.setActive(entity);
			}
			assignDialog.onOpenChange(true);
		},
		[assignDialog, thing],
	);

	const handleDoneClick = useCallback(
		(entity?: ThingData) => {
			const active = thing.active ?? entity;
			if (!active || active.isDone === true) return;
			doneMutation.mutate({ thingId: active.id, isDone: true });
		},
		[thing.active, doneMutation],
	);

	const handleNotDoneClick = useCallback(
		(entity?: ThingData) => {
			const active = thing.active ?? entity;
			if (!active || active.isDone === false) return;
			doneMutation.mutate({ thingId: active.id, isDone: false });
		},
		[thing.active, doneMutation],
	);

	const els: {
		form: KeyboardElement[];
		done: KeyboardElement[];
		notDone: KeyboardElement[];
		detail: KeyboardElement[];
	} = {
		form: [
			{
				id: prefixId("form", "thing"),
				keyActions: {
					Enter: () => textareaRef.current?.focus(),
				},
			},
		],
		done: (listQuery.data ?? [])
			.filter((t) => t.isDone)
			.sort((a, b) => handleSortByDate(a, b, "done"))
			.map((t) => ({
				id: prefixId(t.id, "thing"),
				keyActions: {
					Enter: () => handleDetailClick(t),
					Space: () => handleActionClick(t),
					c: () => handleNotDoneClick(t),
					x: () => handleRemoveClick(t),
				},
			})),
		notDone: (listQuery.data ?? [])
			.filter((t) => !t.isDone)
			.sort((a, b) => handleSortByDate(a, b, "notDone"))
			.map((t) => ({
				id: prefixId(t.id, "thing"),
				keyActions: {
					Enter: () => handleDetailClick(t),
					Space: () => handleActionClick(t),
					c: () => handleDoneClick(t),
					u: () => handleUpdateClick(t),
					a: () => handleAssignClick(t),
					x: () => handleRemoveClick(t),
				},
			})),
		detail: [
			{
				id: prefixId("close", "detail"),
				keyActions: {
					Enter: () => detailDialog.onOpenChange(false),
					Space: () => detailDialog.onOpenChange(false),
				},
			},
			{
				id: prefixId("update", "detail"),
				keyActions: {
					Enter: () => handleUpdateClick(),
					Space: () => handleUpdateClick(),
				},
			},
			{
				id: prefixId("remove", "detail"),
				keyActions: {
					Enter: () => handleRemoveClick(),
					Space: () => handleRemoveClick(),
				},
			},
		],
	};

	function handleReset() {
		thing.setActive(null);
		createForm.reset();
		updateForm.reset();
		actionDialog.onOpenChange(false);
		updateDialog.onOpenChange(false);
		detailDialog.onOpenChange(false);
		assignDialog.onOpenChange(false);
		removeDialog.onOpenChange(false);
	}

	function handleSortByDate(a: ThingData, b: ThingData, variant: "done" | "notDone") {
		const getTime = (input: string) => new Date(input).getTime();

		if (variant === "done") {
			return getTime(b.doneDate ?? b.createdAt) - getTime(a.doneDate ?? a.createdAt);
		} else {
			return getTime(b.createdAt) - getTime(a.createdAt);
		}
	}

	return {
		t,
		find: thing.find,
		listQuery,
		els,
		textareaRef,
		createMutation,
		updateMutation,
		assignMutation,
		doneMutation,
		removeMutation,
		createForm,
		updateForm,
		active: thing.active,
		actionDialog,
		updateDialog,
		detailDialog,
		removeDialog,
		assignDialog,
		handleActionClick,
		handleDetailClick,
		handleUpdateClick,
		handleRemoveClick,
		handleNotDoneClick,
		handleDoneClick,
		handleSortByDate,
	};
}
