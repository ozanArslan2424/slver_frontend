import type { StringBoolean } from "@/lib/helper.type";
import { cn, toBoolean, toStringBoolean } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { useCallback, useEffect, useState, type ComponentProps, type ReactNode } from "react";

type CheckboxProps = {
	id?: string;
	name?: string;
	value?: boolean;
	defaultValue?: boolean;
	onChange?: (checked: boolean) => void;
	renderChildren?: (checked: boolean) => ReactNode;
	unstyled?: boolean;
} & Omit<ComponentProps<"button">, "onChange">;

export function Checkbox({
	id,
	name,
	value,
	defaultValue,
	onChange,
	className,
	renderChildren,
	unstyled = false,
	...rest
}: CheckboxProps) {
	const isControlled = value !== undefined;
	const [internal, setInternal] = useState<StringBoolean>(
		toStringBoolean(isControlled ? value : defaultValue),
	);

	useEffect(() => {
		if (isControlled) setInternal(toStringBoolean(value));
	}, [isControlled, value]);

	const checked = isControlled ? toBoolean(value) : toBoolean(internal);

	const handleClick = useCallback(() => {
		const next = !checked;
		if (!isControlled) setInternal(toStringBoolean(next));
		onChange?.(next);
	}, [checked, isControlled, onChange]);

	return (
		<>
			<input
				type="text"
				id={`${name}_input`}
				name={name}
				value={internal}
				readOnly
				className="sr-only"
			/>
			<button
				{...rest}
				id={id}
				type="button"
				role="checkbox"
				aria-checked={checked}
				onClick={handleClick}
				className={unstyled ? className : cn("square sm", checked ? "primary" : "soft", className)}
			>
				{renderChildren ? renderChildren(checked) : <CheckIcon />}
			</button>
		</>
	);
}
