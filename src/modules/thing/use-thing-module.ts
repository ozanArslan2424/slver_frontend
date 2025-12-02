import { useAppContext } from "@/app";
import { useModal } from "@/hooks/use-modal";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";
import { ThingCreateSchema, type ThingData } from "@/modules/thing/thing.schema";
import { useLanguage } from "@/modules/language/use-language";
import { prefixId } from "@/lib/utils";
import { useForm } from "@/hooks/use-form";
import type { SlimItem } from "@/modules/keyboard/keyboard.schema";
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

	const updateDialog = useModal();
	const detailDialog = useModal();
	const assignDialog = useActionDialog({
		actions: [],
		title: t("assign.label"),
		description: t("assign.label"),
	});
	const removeDialog = useModal();
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
							onSelect: () => handleDoneClick(),
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

	const defaultValues = useMemo(() => {
		const active = thing.active;
		if (active) {
			return {
				content: active.content,
				dueDate: active.dueDate,
				assignedToId: active.assignedToId ?? undefined,
			};
		}
		return { content: "", dueDate: undefined, assignedToId: undefined };
	}, [thing.active]);

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
		(entity?: ThingData, value?: boolean) => {
			const active = thing.active ?? entity;
			if (!active) return;
			const isDone = value !== undefined ? value : !active.isDone;
			doneMutation.mutate({ thingId: active.id, isDone });
		},
		[thing.active, doneMutation],
	);

	const handleConfirmRemove = useCallback(() => {
		if (!thing.active) {
			toast.error(t("remove.confirm.error"));
			return;
		}
		removeMutation.mutate({ thingId: thing.active.id });
	}, [removeMutation, t, thing.active]);

	const removeItems: SlimItem[] = [
		{
			id: prefixId("confirm", "thing_remove"),
			actions: [{ keys: ["Enter"], fn: () => handleConfirmRemove() }],
		},
		{
			id: prefixId("cancel", "thing_remove"),
			actions: [{ keys: ["Enter"], fn: () => removeDialog.onOpenChange(false) }],
		},
	];

	const detailItems: SlimItem[] = [
		{
			id: prefixId("update", "thing_detail"),
			actions: [{ keys: ["Enter", "Space"], fn: () => handleUpdateClick() }],
		},
		{
			id: prefixId("remove", "thing_detail"),
			actions: [{ keys: ["Enter", "Space"], fn: () => handleRemoveClick(), items: removeItems }],
		},
		{
			id: prefixId("close", "thing_detail"),
			actions: [{ keys: ["Enter", "Space"], fn: () => detailDialog.onOpenChange(false) }],
		},
	];

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

	const formAction = () => textareaRef.current?.focus();

	return {
		t,
		find: thing.find,
		listQuery,
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
		handleAssignClick,
		handleRemoveClick,
		handleDoneClick,
		handleSortByDate,
		handleConfirmRemove,
		formAction,
		detailItems,
		removeItems,
	};
}
