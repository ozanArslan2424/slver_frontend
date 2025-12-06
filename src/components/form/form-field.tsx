import type { UseFormReturn } from "@/hooks/use-form";
import { cloneElement, type ReactElement } from "react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

type FormFieldProps<F> = {
	id?: string;
	name: keyof F extends string ? keyof F : never;
	label?: string;
	tooltip?: string;
	form: UseFormReturn<F, any, any, any>;
	children: ReactElement<
		{ id: string; name: string; defaultValue?: string | undefined },
		React.FunctionComponent
	>;
	className?: string;
	sublabel?: string;
};

export function FormField<F>(props: FormFieldProps<F>) {
	const id = props.id || props.name;
	const error = props.form.errors?.[props.name as keyof typeof props.form.errors];

	const node = cloneElement<{
		id: string;
		name: string;
		defaultValue?: string | undefined;
	}>(props.children, {
		id,
		name: props.name as string,
		defaultValue:
			(props.form.defaultValues?.[props.name as keyof typeof props.form.defaultValues] as string) ??
			"",
	});

	const renderNode = () =>
		props.tooltip ? (
			<Tooltip tip={props.tooltip}>
				<span>{node}</span>
			</Tooltip>
		) : (
			node
		);

	return (
		<div className={cn("flex w-full flex-1 flex-col gap-1", props.className)}>
			{props.label && <label htmlFor={id}>{props.label}</label>}
			{renderNode()}
			{props.sublabel && (
				<label className="sublabel" htmlFor={id}>
					{props.sublabel}
				</label>
			)}
			{error && (
				<label className="error" htmlFor={id}>
					{error}
				</label>
			)}
		</div>
	);
}
