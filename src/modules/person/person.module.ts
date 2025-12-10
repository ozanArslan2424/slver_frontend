import { apiRoutes } from "@/api.routes";
import { Module } from "@/modules/module.class";
import type { PersonData } from "@/modules/person/person.schema";
import type { QueryModule } from "@/modules/query/query.module";

export class PersonModule extends Module<PersonData> {
	constructor(private readonly queryModule: QueryModule) {
		super();
	}

	find(id: PersonData["id"]) {
		const queryData = this.queryModule.getQueryData<PersonData[]>([apiRoutes.group.list]);
		if (!queryData) return null;
		return queryData.find((t) => t.id === id) ?? null;
	}
}
