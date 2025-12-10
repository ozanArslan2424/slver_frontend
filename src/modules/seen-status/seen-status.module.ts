import { apiRoutes } from "@/api.routes";
import { Module } from "@/modules/module.class";
import type { QueryModule } from "@/modules/query/query.module";
import type { RequestModule } from "@/modules/request/request.module";

export class SeenStatusModule extends Module {
	constructor(
		private readonly queryModule: QueryModule,
		private readonly request: RequestModule,
	) {
		super();
	}

	queryCount = () =>
		this.queryModule.makeQuery({
			queryKey: [apiRoutes.seenStatus.count],
			queryFn: () => this.request.get(apiRoutes.seenStatus.count),
		});
}
