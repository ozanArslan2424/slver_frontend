import { useForm } from "@/hooks/use-form";
import { getErrorMessage } from "@/lib/error.utils";
import { useAppContext } from "@/modules/context/app.context";
import {
	GroupCreateSchema,
	GroupInviteSchema,
	GroupJoinSchema,
} from "@/modules/group/group.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";

export type UseGroupModuleReturn = ReturnType<typeof useGroupModule>;

export function useGroupModule() {
	const { group } = useAppContext();
	const createInputRef = useRef<HTMLInputElement | null>(null);
	const joinInputRef = useRef<HTMLInputElement | null>(null);
	const inviteInputRef = useRef<HTMLInputElement | null>(null);

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
		onSubmit: ({ values }) => {
			groupCreateMutation.mutate(values);
		},
	});

	const joinForm = useForm({
		schema: GroupJoinSchema,
		onSubmit: ({ values }) => {
			groupJoinMutation.mutate(values);
		},
	});

	const inviteForm = useForm({
		schema: GroupInviteSchema,
		defaultValues: {
			role: false,
		},
		onSubmit: ({ values }) => {
			groupInviteMutation.mutate(values);
		},
	});

	const createAction = () => createInputRef.current?.focus();
	const inviteAction = () => inviteInputRef.current?.focus();

	return {
		groupQuery,
		groupCreateMutation,
		groupJoinMutation,
		createForm,
		joinForm,
		inviteForm,
		createInputRef,
		joinInputRef,
		inviteInputRef,
		createAction,
		inviteAction,
	};
}
