import type { TWithId } from "@/lib/helper.type";

export type OnMutationSuccess<V = void, R = void> = (res: R, vars: V) => void;
export type OnMutationError<V = void, E = Error> = (err: E, vars: V) => void;

export type QueryKey = (string | number)[];

export type QueryUpdaterArgs<T extends TWithId> =
	| { action: "create"; queryKey: QueryKey; data: T; pos?: "start" | "end" }
	| { action: "update"; queryKey: QueryKey; data: T }
	| { action: "remove"; queryKey: QueryKey; data: T["id"] }
	| { action: "replace"; queryKey: QueryKey; data: T; prevId: T["id"] };
