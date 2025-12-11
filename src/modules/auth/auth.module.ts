import { clientRoutes } from "@/client.routes";
import type {
	AuthenticatedData,
	AuthLoginData,
	AuthRegisterData,
	AuthResponseData,
	ProfileData,
} from "@/modules/auth/auth.schema";
import type { QueryModule } from "@/modules/query/query.module";
import type { OnMutationError, OnMutationSuccess } from "@/modules/query/query.schema";
import type { RequestModule } from "@/modules/request/request.module";
import type { StoreModule } from "@/modules/store/store.module";
import type { StoreData } from "@/modules/store/store.schema";
import { apiRoutes } from "@/api.routes";
import { Module } from "@/modules/module.class";

export class AuthModule extends Module<ProfileData> {
	constructor(
		private readonly queryModule: QueryModule,
		private readonly request: RequestModule,
		private readonly store: StoreModule<StoreData>,
	) {
		super();
	}

	private setAuthenticatedData(data: AuthenticatedData) {
		this.store.set("accessToken", data.accessToken);
		this.store.set("groupId", data.groupId);
		if (data.refreshToken) {
			sessionStorage.setItem("refreshToken", data.refreshToken);
		} else {
			sessionStorage.removeItem("refreshToken");
		}
	}

	fetchMe = () => this.request.get(apiRoutes.auth.me);

	queryMe = () =>
		this.queryModule.makeQuery<ProfileData>({
			queryKey: [apiRoutes.auth.me],
			queryFn: () => this.request.get(apiRoutes.auth.me),
		});

	login = (
		onSuccess?: OnMutationSuccess<AuthLoginData, AuthResponseData>,
		onError?: OnMutationError<AuthLoginData>,
	) =>
		this.queryModule.makeMutation<AuthLoginData, AuthResponseData>({
			mutationFn: (body) => this.request.post(apiRoutes.auth.login, body),
			onSuccess: (res, vars) => {
				this.setAuthenticatedData({
					refreshToken: res.refreshToken,
					accessToken: res.accessToken,
					groupId: res.profile.memberships.length !== 0 ? res.profile.memberships[0].groupId : null,
				});
				this.queryModule.clear();
				onSuccess?.(res, vars);
			},
			onError,
		});

	register = (
		onSuccess?: OnMutationSuccess<AuthRegisterData, AuthResponseData>,
		onError?: OnMutationError<AuthRegisterData>,
	) =>
		this.queryModule.makeMutation<AuthRegisterData, AuthResponseData>({
			mutationFn: (body) => this.request.post(apiRoutes.auth.register, body),
			onSuccess: (res, vars) => {
				this.setAuthenticatedData({
					refreshToken: res.refreshToken,
					accessToken: res.accessToken,
					groupId: res.profile.memberships.length !== 0 ? res.profile.memberships[0].groupId : null,
				});
				this.queryModule.clear();
				onSuccess?.(res, vars);
			},
			onError,
		});

	logout = (onSuccess?: OnMutationSuccess) =>
		this.queryModule.makeMutation({
			mutationFn: async () => {
				await this.request.post(apiRoutes.auth.logout, {
					refreshToken: sessionStorage.getItem("refreshToken"),
				});
			},
			onSuccess: (res, vars) => {
				window.location.href = clientRoutes.landing;
				this.setAuthenticatedData({
					refreshToken: null,
					accessToken: null,
					groupId: null,
				});
				this.queryModule.clear();
				onSuccess?.(res, vars);
			},
		});
}
