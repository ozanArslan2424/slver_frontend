import * as React from "react";
import { Popover } from "@/components/modals/popover";
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useLanguage } from "@/modules/language/use-language";

type Option = { value: string; label: string };

type ComboboxProps<O extends Option> = {
	id?: string;
	name?: string;
	placeholder?: string;
	searchPlaceholder?: string;
	value?: string | null;
	onValueChange?: (value: string | null) => void;
	onCreateOption?: (option: O) => void;
	options: O[];
	hideCreate?: boolean;
	renderTrigger?: (open: boolean, opt: O | null) => React.ReactNode;
	align?: "center" | "end" | "start";
	side?: "top" | "right" | "bottom" | "left";
};

const CLEAR_VALUE = "___";

export function Combobox<O extends Option>({
	id,
	name,
	placeholder,
	searchPlaceholder,
	value,
	onValueChange,
	onCreateOption,
	options,
	hideCreate,
	renderTrigger,
	align = "start",
	side = "bottom",
}: ComboboxProps<O>) {
	const [open, onOpenChange] = React.useState(false);
	const { t } = useLanguage("common");
	const [inputValue, setInputValue] = React.useState("");
	const [internalOptions, setInternalOptions] = React.useState(options);
	const [internalValue, setInternalValue] = React.useState<O | null>(
		options.find((opt) => opt.value === value) || null,
	);

	function handleSelect(selectedValue: string) {
		if (selectedValue === CLEAR_VALUE) {
			setInternalValue(null);
			onValueChange?.(null);
			onOpenChange(false);
		} else {
			const selectedOption = internalOptions.find((opt) => opt.value === selectedValue);
			if (selectedOption) {
				setInternalValue(selectedOption);
				onValueChange?.(selectedOption.value);
				onOpenChange(false);
			}
		}
	}

	function handleCreateOption(label: string) {
		const newOption = {
			value: label.toLowerCase().replace(/\s+/g, "-"),
			label,
		} as O;
		setInternalOptions((prev) => [...prev, newOption]);
		setInternalValue(newOption);
		onCreateOption?.(newOption);
		onValueChange?.(newOption.value);
		onOpenChange(false);
	}

	const filteredOptions = internalOptions.filter((opt) =>
		opt.label.toLowerCase().includes(inputValue.toLowerCase()),
	);

	return (
		<>
			<input type="hidden" id={id} name={name} value={internalValue?.value || ""} />
			<Popover
				id={`${id ?? name}_popover`}
				open={open}
				onOpenChange={onOpenChange}
				className="w-auto overflow-hidden p-0"
				align={align}
				side={side}
				trigger={(open) =>
					renderTrigger ? (
						renderTrigger(open, internalValue)
					) : (
						<button type="button" className="w-full justify-start outline">
							{internalValue ? internalValue.label : placeholder}
						</button>
					)
				}
			>
				<Command>
					<CommandInput
						placeholder={searchPlaceholder || t("searchPlaceholder")}
						value={inputValue}
						onValueChange={setInputValue}
					/>
					<CommandList>
						<CommandGroup>
							<CommandItem
								className="text-muted-foreground"
								value={CLEAR_VALUE}
								onSelect={handleSelect}
							>
								{t("clear")}
							</CommandItem>
							{filteredOptions.map((opt) => (
								<CommandItem key={opt.value} value={opt.value} onSelect={handleSelect}>
									{opt.label}
								</CommandItem>
							))}
							{!hideCreate &&
								inputValue &&
								!filteredOptions.some(
									(opt) => opt.label.toLowerCase() === inputValue.toLowerCase(),
								) && (
									<CommandItem
										value={`__create__${inputValue}`}
										onSelect={() => handleCreateOption(inputValue)}
									>
										{t("create")} "{inputValue}"
									</CommandItem>
								)}
						</CommandGroup>
					</CommandList>
				</Command>
			</Popover>
		</>
	);
}
