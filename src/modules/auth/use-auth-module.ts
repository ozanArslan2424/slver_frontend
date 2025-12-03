import { useForm } from "@/hooks/use-form";
import { getErrorMessage } from "@/lib/error.utils";
import { clientRoutes } from "@/client.routes";
import { AuthLoginSchema, AuthRegisterSchema } from "@/modules/auth/auth.schema";
import { useLanguage } from "@/modules/language/use-language";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Status } from "@/modules/person/person.schema";
import { useAppContext } from "@/modules/context/app.context";

export type UseAuthModuleReturn = ReturnType<typeof useAuthModule>;

export function useAuthModule() {
	const { t } = useLanguage("auth");
	const { auth } = useAppContext();
	const nav = useNavigate();

	const meQuery = useQuery(auth.queryMe());
	const noGroup =
		meQuery.data?.memberships.filter((m) => m.status === Status.accepted).length === 0;
	const pendingMemberships = meQuery.data?.memberships.filter((m) => m.status === Status.pending);

	const logoutMutation = useMutation(auth.logout());
	const loginMutation = useMutation(
		auth.login(
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
		auth.register(
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
		onSubmit: ({ values }) => loginMutation.mutate(values),
	});

	const registerForm = useForm({
		schema: AuthRegisterSchema,
		onSubmit: ({ values }) => registerMutation.mutate(values),
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
