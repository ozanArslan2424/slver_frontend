import type { TWithId } from "@/lib/helper.type";
import type { QueryKey, QueryUpdaterArgs } from "@/modules/query/query.schema";
import {
	QueryClient,
	type DefaultError,
	type QueryClientConfig,
	type UseMutationOptions,
} from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export class QueryModule extends QueryClient {
	constructor(readonly queryConfig: QueryClientConfig) {
		super(queryConfig);
	}

	makeQuery = queryOptions;

	makeMutation = <V = void, R = unknown, TOnMutateResult = unknown>(
		options: UseMutationOptions<R, DefaultError, V, TOnMutateResult>,
	) => options;

	makeOptimisticMutation = <V = void, R = unknown, TQueryData = unknown>({
		queryKey,
		updater,
		onChange,
		...options
	}: UseMutationOptions<R, DefaultError, V, () => void> & {
		queryKey: QueryKey;
		updater: (prev: TQueryData, vars: V) => TQueryData;
		onChange?: (res: R | undefined, err: DefaultError | null, vars: V) => void;
	}): UseMutationOptions<R, DefaultError, V, () => void> => ({
		onMutate: (vars, ctx) => {
			const snapshot = ctx.client.getQueryData<TQueryData>(queryKey);
			ctx.client.setQueryData<TQueryData>(queryKey, (prev) => {
				if (!prev) return prev;
				return updater(prev, vars);
			});
			return () => {
				ctx.client.setQueryData(queryKey, snapshot);
			};
		},
		onSettled: (res, err, vars, revert) => {
			onChange?.(res, err, vars);
			if (err) {
				toast.error(err.message);
				revert?.();
			}
		},
		...options,
	});

	invalidateAll(queryKeys: QueryKey[]) {
		return Promise.all(queryKeys.map((queryKey) => this.invalidateQueries({ queryKey })));
	}

	updateListData<T extends TWithId>(args: QueryUpdaterArgs<T>) {
		const snapshot = this.getQueryData(args.queryKey);

		this.setQueryData<T[]>(args.queryKey, (prev) => {
			if (!prev) return [];
			switch (args.action) {
				case "create":
					return args.pos === "start" ? [args.data, ...prev] : [...prev, args.data];
				case "update":
					return prev.map((t) => (t.id === args.data.id ? args.data : t));
				case "remove":
					return prev.filter((t) => t.id !== args.data);
				case "replace":
					return prev.map((t) => (t.id === args.prevId ? args.data : t));
				default:
					return [];
			}
		});

		const revert = () => {
			this.setQueryData(args.queryKey, snapshot);
		};

		return revert;
	}

	failAfter(ms: number = 2000, msg?: string): Promise<never> {
		return new Promise((_, reject) => {
			setTimeout(() => reject(new Error(msg)), ms);
		});
	}
}
