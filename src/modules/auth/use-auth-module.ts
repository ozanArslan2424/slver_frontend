import { useAppContext } from "@/app";
import { useForm } from "@/hooks/use-form";
import { getErrorMessage } from "@/lib/error.utils";
import { clientRoutes } from "@/client.routes";
import { AuthLoginSchema, AuthRegisterSchema } from "@/modules/auth/auth.schema";
import { useLanguage } from "@/modules/language/use-language";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Status } from "@/modules/person/person.schema";

export type UseAuthModuleReturn = ReturnType<typeof useAuthModule>;

export function useAuthModule() {
	const { t } = useLanguage("auth");
	const ctx = useAppContext();
	const nav = useNavigate();

	const meQuery = useQuery(ctx.auth.queryMe());
	const noGroup =
		meQuery.data?.memberships.filter((m) => m.status === Status.accepted).length === 0;
	const pendingMemberships = meQuery.data?.memberships.filter((m) => m.status === Status.pending);

	const logoutMutation = useMutation(ctx.auth.logout());
	const loginMutation = useMutation(
		ctx.auth.login(
			() => {
				nav(clientRoutes.dashboard);
			},
			(err) => {
				console.log(err);
				loginForm.setRootError(getErrorMessage(err));
			},
		),
	);
	const registerMutation = useMutation(
		ctx.auth.register(
			() => {
				nav(clientRoutes.dashboard);
			},
			(err) => {
				registerForm.setRootError(getErrorMessage(err));
			},
		),
	);

	const loginForm = useForm({
		schema: AuthLoginSchema,
		onSubmit: (body) => loginMutation.mutate(body),
	});

	const registerForm = useForm({
		schema: AuthRegisterSchema,
		onSubmit: (body) => registerMutation.mutate(body),
	});

	return {
		t,
		loginForm,
		loginMutation,
		registerForm,
		registerMutation,
		meQuery,
		noGroup,
		pendingMemberships,
		logoutMutation,
	};
}
