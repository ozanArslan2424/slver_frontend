import { QueryModule } from "@/modules/query/query.module";
import { queryConfig } from "@/modules/query/query.config";
import { AuthModule } from "@/modules/auth/auth.module";
import { ThingModule } from "@/modules/thing/thing.module";
import { PersonModule } from "@/modules/person/person.module";
import { GroupModule } from "@/modules/group/group.module";
import { RequestModule } from "@/modules/request/request.module";
import { StoreModule } from "@/modules/store/store.module";
import type { StoreData } from "@/modules/store/store.schema";
import { apiRoutes } from "@/api.routes";
import i18n from "@/modules/language/language.config";
import { createContext, use, type PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

const groupIdHeader = "x-group-id";
const languageHeader = "x-lang";

function makeContext() {
	const store = new StoreModule<StoreData>({
		accessToken: null,
		groupId: null,
	});
	const request = new RequestModule(store, {
		baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`,
		refreshEndpoint: apiRoutes.auth.refresh,
		beforeRequest: (config) => {
			const groupId = store.get("groupId");
			if (groupId) {
				config.headers[groupIdHeader] = groupId;
			}
			const lang = i18n.language;
			config.headers[languageHeader] = lang;
		},
	});
	const query = new QueryModule(queryConfig);
	const auth = new AuthModule(query, request, store);
	const person = new PersonModule(query);
	const group = new GroupModule(query, request, store);
	const thing = new ThingModule(query, request, auth, person);

	return {
		store,
		query,
		auth,
		thing,
		person,
		group,
	};
}

const context = makeContext();

const AppContext = createContext<typeof context>(context);

export function useAppContext() {
	const value = use(AppContext);
	if (!value) throw new Error("AppContext requires a provider.");
	return value;
}

export function AppContextProvider({ children }: PropsWithChildren) {
	return (
		<QueryClientProvider client={context.query}>
			<AppContext value={context}>{children}</AppContext>
		</QueryClientProvider>
	);
}
