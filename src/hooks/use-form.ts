import type { DefaultError, UseMutationResult } from "@tanstack/react-query";
import { useCallback, useRef, useState, useTransition } from "react";
import { z } from "zod/v4";

export type TFormErrors<TFields> = z.core.$ZodFlattenedError<TFields, string>["fieldErrors"] & {
	_root: string[];
};

export type UseFormArgs<T, V = void, R = unknown, TOnMutateResult = unknown> = {
	schema: z.ZodType<T>;
	onSubmit: (submitData: {
		values: T;
		formData: FormData;
		defaultValues?: Partial<T>;
	}) => void | Promise<void>;
	onReset?: () => void;
	defaultValues?: Partial<T>;
	mutation?: UseMutationResult<R, DefaultError, V, TOnMutateResult>;
};

export type UseFormReturn<T, V = void, R = unknown, TOnMutateResult = unknown> = {
	methods: {
		onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
		onReset: () => void;
		ref: React.RefObject<HTMLFormElement | null>;
		noValidate?: boolean;
	};
	defaultValues: Partial<T> | undefined;
	errors: TFormErrors<T>;
	setRootError: (rootError: string | Array<string>) => void;
	reset: () => void;
	isPending: boolean;
	mutation?: UseMutationResult<R, DefaultError, V, TOnMutateResult>;
};

const emptyErrors: TFormErrors<unknown> = { _root: [] };

export function useForm<T, V = void, R = unknown, TOnMutateResult = unknown>(
	args: UseFormArgs<T, V, R, TOnMutateResult>,
): UseFormReturn<T, V, R, TOnMutateResult> {
	const [isPending, startPending] = useTransition();
	const [errors, setErrors] = useState<TFormErrors<T>>(emptyErrors);
	const ref = useRef<HTMLFormElement>(null);

	const onSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			startPending(async () => {
				const formData = new FormData(e.currentTarget);
				const formDataObject: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};

				for (const name of formData.keys()) {
					const allValues = formData.getAll(name);
					formDataObject[name] = allValues.length > 1 ? allValues : allValues[0] || "";
				}

				if (import.meta.env.DEV) {
					console.log(formDataObject);
				}

				const parseResult = args.schema.safeParse(formDataObject);
				if (!parseResult.success) {
					if (import.meta.env.NODE_ENV === "development") {
						console.log(parseResult.error.issues);
					}

					setErrors({
						...z.flattenError(parseResult.error).fieldErrors,
						_root: [],
					});
					return;
				}
				setErrors(emptyErrors);
				const submitData = {
					values: parseResult.data,
					defaultValues: args.defaultValues,
					formData,
				};
				args.onSubmit(submitData);
			});
		},
		[args],
	);

	const onReset = useCallback(() => {
		ref.current?.reset();
		setErrors(emptyErrors);
		args.onReset?.();
	}, [args]);

	const reset = useCallback(() => {
		ref.current?.reset();
		setErrors(emptyErrors);
	}, []);

	const setRootError = useCallback((rootError: string | Array<string>) => {
		setErrors((prev) => ({
			...prev,
			_root: Array.isArray(rootError) ? rootError : [rootError],
		}));
	}, []);

	return {
		methods: { onSubmit, onReset, ref, noValidate: true },
		errors,
		defaultValues: args.defaultValues,
		reset,
		setRootError,
		mutation: args.mutation,
		isPending: args.mutation ? args.mutation.isPending : isPending,
	};
}
