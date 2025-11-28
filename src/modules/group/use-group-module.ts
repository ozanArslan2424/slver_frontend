import { useAppContext } from "@/app";
import { useForm } from "@/hooks/use-form";
import { getErrorMessage } from "@/lib/error.utils";
import { prefixId } from "@/lib/utils";
import {
	GroupCreateSchema,
	GroupInviteSchema,
	GroupJoinSchema,
} from "@/modules/group/group.schema";
import type { KeyboardElement } from "@/modules/keyboard/keyboard.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export type UseGroupModuleReturn = ReturnType<typeof useGroupModule>;

export function useGroupModule() {
	const { group } = useAppContext();
	const { t } = useTranslation("group");
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
		onSubmit: (body) => {
			groupCreateMutation.mutate(body);
		},
	});

	const joinForm = useForm({
		schema: GroupJoinSchema,
		onSubmit: (body) => {
			groupJoinMutation.mutate(body);
		},
	});

	const inviteForm = useForm({
		schema: GroupInviteSchema,
		defaultValues: {
			role: false,
		},
		onSubmit: (body) => {
			groupInviteMutation.mutate(body);
		},
	});

	const els: {
		noGroup: KeyboardElement;
		yesGroup: KeyboardElement;
	} = {
		noGroup: {
			id: prefixId("create", "group"),
			keyActions: {
				Enter: () => createInputRef.current?.focus(),
			},
		},

		yesGroup: {
			id: prefixId("invite", "group"),
			keyActions: {
				Enter: () => inviteInputRef.current?.focus(),
			},
		},
	};

	return {
		t,
		els,
		groupQuery,
		groupCreateMutation,
		groupJoinMutation,
		createForm,
		joinForm,
		inviteForm,
		createInputRef,
		joinInputRef,
		inviteInputRef,
	};
}
