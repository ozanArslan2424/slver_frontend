import { useAppContext } from "@/app";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { PersonData } from "@/modules/person/person.schema";
import { useLanguage } from "@/modules/language/use-language";
import { toast } from "sonner";
import { useActionDialog } from "@/hooks/use-action-dialog";
import { useCallback } from "react";
import { useDialog } from "@/hooks/use-dialog";

export type UsePersonModuleReturn = ReturnType<typeof usePersonModule>;

export function usePersonModule() {
	const { auth, person, thing, group } = useAppContext();
	const { t } = useLanguage("person");

	const meQuery = useQuery(auth.queryMe());
	const listQuery = useQuery(group.queryPersonList());

	const assignMutation = useMutation(thing.assign(handleReset));
	const removeMutation = useMutation(group.remove(handleReset));

	const assignDialog = useActionDialog({
		actions: [],
		title: t("assign.label"),
		description: t("assign.label"),
	});
	const actionDialog = useActionDialog({
		actions: [
			{
				key: "assign",
				label: t("assign.label"),
				onSelect: () => handleAssignClick(),
			},
			...(person.active?.id === meQuery.data?.id
				? []
				: [{ key: "remove", label: t("remove.label"), onSelect: () => handleRemoveClick() }]),
		],
	});
	const removeDialog = useDialog();

	const handleAction = useCallback(
		(entity: PersonData) => {
			person.setActive(entity);
			actionDialog.onOpenChange(true);
		},
		[person, actionDialog],
	);

	const handleRemoveClick = useCallback(
		(entity?: PersonData) => {
			if (entity) {
				person.setActive(entity);
			}
			removeDialog.onOpenChange(true);
		},
		[person, removeDialog],
	);

	const handleAssignClick = useCallback(
		(entity?: PersonData) => {
			if (entity) {
				person.setActive(entity);
			}
			assignDialog.onOpenChange(true);
		},
		[person, assignDialog],
	);

	const handleConfirmRemove = useCallback(() => {
		if (!person.active) {
			toast.error(t("remove.confirm.error"));
			return;
		}
		removeMutation.mutate({ personId: person.active.id });
	}, [removeMutation, t, person.active]);

	function handleReset() {
		person.setActive(null);
		actionDialog.onOpenChange(false);
		removeDialog.onOpenChange(false);
		assignDialog.onOpenChange(false);
	}

	return {
		t,
		listQuery,
		assignMutation,
		active: person.active,
		actionDialog,
		assignDialog,
		removeDialog,
		handleAction,
		handleRemoveClick,
		handleConfirmRemove,
	};
}
