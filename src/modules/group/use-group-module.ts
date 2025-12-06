import { useForm } from "@/hooks/use-form";
import { getErrorMessage } from "@/lib/error.utils";
import { useAppContext } from "@/modules/context/app.context";
import {
	GroupCreateSchema,
	GroupInviteSchema,
	GroupJoinSchema,
} from "@/modules/group/group.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export type UseGroupModuleReturn = ReturnType<typeof useGroupModule>;

export function useGroupModule() {
	const { group } = useAppContext();

	const groupQuery = useQuery(group.get());

	const groupCreateMutation = useMutation(
		group.create(
			() => {
				createForm.reset();
			},
			(err) => {
				createForm.setRootError(getErrorMessage(err));
			},
		),
	);

	const groupJoinMutation = useMutation(
		group.join(
			() => {
				joinForm.reset();
			},
			(err) => {
				joinForm.setRootError(getErrorMessage(err));
			},
		),
	);

	const groupInviteMutation = useMutation(
		group.invite(
			() => {
				inviteForm.reset();
			},
			(err) => {
				inviteForm.setRootError(getErrorMessage(err));
			},
		),
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
		defaultValues: {
			role: false,
		},
		onSubmit: ({ values }) => {
			groupInviteMutation.mutate(values);
		},
	});

	return {
		groupQuery,
		createForm,
		joinForm,
		inviteForm,
	};
}
