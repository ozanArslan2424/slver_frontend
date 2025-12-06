import type { QueryModule } from "@/modules/query/query.module";
import type {
	ThingData,
	ThingCreateData,
	ThingUpdateData,
	ThingRemoveData,
	ThingAssignData,
	ThingDoneData,
} from "@/modules/thing/thing.schema";
import type { RequestModule } from "@/modules/request/request.module";
import { apiRoutes } from "@/api.routes";
import { Module } from "@/modules/module.class";
import type { PersonModule } from "@/modules/person/person.module";
import type { AuthModule } from "@/modules/auth/auth.module";

export class ThingModule extends Module<ThingData> {
	constructor(
		private readonly queryModule: QueryModule,
		private readonly request: RequestModule,
		private readonly authModule: AuthModule,
		private readonly personModule: PersonModule,
	) {
		super(ThingModule.name);
	}

	readonly queryList = () =>
		this.queryModule.makeQuery<ThingData[]>({
			queryKey: [apiRoutes.thing.list],
			queryFn: () => this.request.get(apiRoutes.thing.list),
		});

	make(data: Partial<ThingData>): ThingData {
		const assignedTo = data.assignedToId ? this.personModule.find(data.assignedToId) : null;
		const createdById = this.authModule.active?.id ?? -1;
		return {
			id: data.id ?? -1,
			assignedTo,
			assignedToId: data.assignedToId ?? null,
			content: data.content ?? "",
			createdById,
			createdAt: data.createdAt ?? new Date().toISOString(),
			isDone: data.isDone ?? false,
			updatedAt: data.updatedAt ?? null,
			doneDate: data.doneDate ?? null,
			dueDate: data.dueDate ?? data.dueDate,
			_placeholder: !data.id,
		};
	}

	find = (id: ThingData["id"]): ThingData | null => {
		const queryData = this.queryModule.getQueryData<ThingData[]>([apiRoutes.thing.list]);
		if (!queryData) return null;
		return queryData.find((t) => t.id === id) ?? null;
	};

	readonly create = (onSuccess?: () => void, onError?: (err: Error) => void) =>
		this.queryModule.makeOptimisticMutation<ThingCreateData, ThingData, ThingData[]>({
			mutationFn: (body) => this.request.post(apiRoutes.thing.create, body),
			queryKey: [apiRoutes.thing.list],
			updater: (prev, vars) => {
				const placeholder = this.make(vars);
				return [placeholder, ...prev];
			},
			onError,
			onSuccess: (res) => {
				this.queryModule.updateListData({
					queryKey: [apiRoutes.thing.list],
					action: "replace",
					data: res,
					prevId: -1,
				});
				onSuccess?.();
			},
		});

	readonly update = (onSuccess?: () => void, onError?: (err: Error) => void) =>
		this.queryModule.makeOptimisticMutation<ThingUpdateData, ThingData, ThingData[]>({
			queryKey: [apiRoutes.thing.list],
			mutationFn: (body) => this.request.post(apiRoutes.thing.update, body),
			onSuccess,
			onError,
			updater: (prev, vars) =>
				prev.map((t) => {
					if (t.id === vars.thingId) {
						return this.make({
							...t,
							...vars,
							updatedAt: new Date().toISOString(),
						});
					} else {
						return t;
					}
				}),
		});

	readonly remove = (onSuccess?: () => void, onError?: (err: Error) => void) =>
		this.queryModule.makeOptimisticMutation<ThingRemoveData, ThingData, ThingData[]>({
			queryKey: [apiRoutes.thing.list],
			mutationFn: (body) => this.request.post(apiRoutes.thing.remove, body),
			onSuccess,
			onError,
			updater: (prev, vars) => prev.filter((t) => t.id !== vars.thingId),
		});

	readonly assign = (onSuccess?: () => void, onError?: (err: Error) => void) =>
		this.queryModule.makeOptimisticMutation<ThingAssignData, ThingData, ThingData[]>({
			queryKey: [apiRoutes.thing.list],
			mutationFn: (body) => this.request.post(apiRoutes.thing.assign, body),
			onSuccess,
			onError,
			updater: (prev, vars) =>
				prev.map((t) => {
					if (t.id === vars.thingId) {
						return this.make({ ...t, assignedToId: vars.personId });
					} else {
						return t;
					}
				}),
		});

	readonly done = (onSuccess?: () => void, onError?: (err: Error) => void) =>
		this.queryModule.makeOptimisticMutation<ThingDoneData, ThingData, ThingData[]>({
			queryKey: [apiRoutes.thing.list],
			mutationFn: (body) => this.request.post(apiRoutes.thing.done, body),
			onSuccess,
			onError,
			updater: (prev, vars) =>
				prev.map((t) => {
					if (t.id === vars.thingId) {
						return this.make({
							...t,
							doneDate: new Date().toISOString(),
							isDone: vars.isDone,
						});
					} else {
						return t;
					}
				}),
		});
}
