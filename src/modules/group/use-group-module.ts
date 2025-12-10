import { useForm } from "@/hooks/use-form";
import { useModal } from "@/hooks/use-modal";
import { getErrorMessage } from "@/lib/error.utils";
import { useAppContext } from "@/modules/context/app.context";
import { useModalContext } from "@/modules/context/modal.context";
import {
	GroupCreateSchema,
	GroupInviteSchema,
	GroupJoinSchema,
} from "@/modules/group/group.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export type UseGroupModuleReturn = ReturnType<typeof useGroupModule>;

export function useGroupModule() {
	const { setModal } = useModalContext();
	const { group } = useAppContext();
	const inviteModal = useModal();

	const groupQuery = useQuery(group.get());

	const groupCreateMutation = useMutation(
		group.create(handleReset, (err) => createForm.setRootError(getErrorMessage(err))),
	);
	const groupJoinMutation = useMutation(
		group.join(handleReset, (err) => joinForm.setRootError(getErrorMessage(err))),
	);
	const groupInviteMutation = useMutation(
		group.invite(handleReset, (err) => inviteForm.setRootError(getErrorMessage(err))),
	);

	const createForm = useForm({
		schema: GroupCreateSchema,
		mutation: groupCreateMutation,
		onSubmit: ({ values }) => {
			groupCreateMutation.mutate(values);
		},
	});

	const joinForm = useForm({
		schema: GroupJoinSchema,
		mutation: groupJoinMutation,
		onSubmit: ({ values }) => {
			groupJoinMutation.mutate(values);
		},
	});

	const inviteForm = useForm({
		schema: GroupInviteSchema,
		mutation: groupInviteMutation,
		defaultValues: { role: false },
		onSubmit: ({ values }) => {
			groupInviteMutation.mutate(values);
		},
	});

	function handleReset() {
		createForm.reset();
		joinForm.reset();
		inviteForm.reset();
		setModal(null);
	}

	return {
		groupQuery,
		inviteModal,
		createForm,
		joinForm,
		inviteForm,
	};
}
