import { apiRoutes } from "@/api.routes";
import type {
	GroupCreateData,
	GroupData,
	GroupInviteData,
	GroupJoinData,
	GroupRemoveData,
} from "@/modules/group/group.schema";
import { Module } from "@/modules/module.class";
import { PersonRoleEnum, type PersonData } from "@/modules/person/person.schema";
import type { QueryModule } from "@/modules/query/query.module";
import type { OnMutationSuccess } from "@/modules/query/query.schema";
import type { RequestModule } from "@/modules/request/request.module";
import type { StoreModule } from "@/modules/store/store.module";
import type { StoreData } from "@/modules/store/store.schema";

export class GroupModule extends Module<GroupData> {
	constructor(
		private readonly queryModule: QueryModule,
		private readonly request: RequestModule,
		private readonly store: StoreModule<StoreData>,
	) {
		super(GroupModule.name);
	}

	setGroupId(value: number | null) {
		this.store.set("groupId", value);
	}

	queryPersonList = () =>
		this.queryModule.makeQuery<PersonData[]>({
			queryKey: [apiRoutes.group.list],
			queryFn: () => this.request.get(apiRoutes.group.list),
		});

	get = () =>
		this.queryModule.makeQuery<GroupData>({
			queryKey: [apiRoutes.group.get],
			queryFn: () => this.request.get(apiRoutes.group.get),
		});

	create = (
		onSuccess?: OnMutationSuccess<GroupCreateData, GroupData>,
		onError?: (err: Error) => void,
	) =>
		this.queryModule.makeMutation<GroupCreateData, GroupData>({
			mutationFn: (body) => this.request.post(apiRoutes.group.create, body),
			onSuccess: (res, vars) => {
				this.setGroupId(res.id);
				this.queryModule.invalidateAll([
					[apiRoutes.auth.me],
					[apiRoutes.group.list],
					[apiRoutes.group.get],
				]);
				onSuccess?.(res, vars);
			},
			onError,
		});

	join = (
		onSuccess?: OnMutationSuccess<GroupJoinData, GroupData>,
		onError?: (err: Error) => void,
	) =>
		this.queryModule.makeMutation<GroupJoinData, GroupData>({
			mutationFn: (body) => this.request.post(apiRoutes.group.join, body),
			onSuccess: (res, vars) => {
				this.setGroupId(res.id);
				this.queryModule.invalidateAll([
					[apiRoutes.auth.me],
					[apiRoutes.group.list],
					[apiRoutes.group.get],
				]);
				onSuccess?.(res, vars);
			},
			onError,
		});

	invite = (
		onSuccess?: OnMutationSuccess<GroupInviteData, GroupData>,
		onError?: (err: Error) => void,
	) =>
		this.queryModule.makeMutation<GroupInviteData, GroupData>({
			mutationFn: (body) =>
				this.request.post(apiRoutes.group.invite, {
					email: body.email,
					role: body.role ? PersonRoleEnum.admin : PersonRoleEnum.user,
				}),
			onSuccess: (res, vars) => {
				this.queryModule.invalidateAll([
					[apiRoutes.auth.me],
					[apiRoutes.group.list],
					[apiRoutes.group.get],
				]);
				onSuccess?.(res, vars);
			},
			onError,
		});

	remove = (onSuccess?: OnMutationSuccess<GroupRemoveData, void>) =>
		this.queryModule.makeMutation<GroupRemoveData, void>({
			mutationFn: (body) => this.request.post(apiRoutes.group.remove, body),
			onSuccess: (res, vars) => {
				this.queryModule.updateListData({
					queryKey: [apiRoutes.group.list],
					action: "remove",
					data: vars.personId,
				});
				onSuccess?.(res, vars);
			},
		});
}
