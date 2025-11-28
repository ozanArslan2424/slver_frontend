import * as React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

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

type RenderCommandProps<O extends Option> = {
	searchPlaceholder?: string;
	inputValue: string;
	setInputValue: (value: string) => void;
	filteredOptions: O[];
	handleSelect: (value: string) => void;
	handleCreateOption: (label: string) => void;
	hideCreate?: boolean;
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
	const [open, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");
	const [internalOptions, setInternalOptions] = React.useState(options);
	const isMobile = useIsMobile();
	const [internalValue, setInternalValue] = React.useState<O | null>(
		options.find((opt) => opt.value === value) || null,
	);

	function handleSelect(selectedValue: string) {
		if (selectedValue === CLEAR_VALUE) {
			setInternalValue(null);
			onValueChange?.(null);
			setOpen(false);
			return;
		}

		const selectedOption = internalOptions.find((opt) => opt.value === selectedValue);
		if (selectedOption) {
			setInternalValue(selectedOption);
			onValueChange?.(selectedOption.value);
			setOpen(false);
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
		setOpen(false);
	}

	const filteredOptions = internalOptions.filter((opt) =>
		opt.label.toLowerCase().includes(inputValue.toLowerCase()),
	);

	if (isMobile) {
		return (
			<>
				<input type="hidden" id={id} name={name} value={internalValue?.value || ""} />
				<Drawer open={open} onOpenChange={setOpen}>
					<DrawerTrigger asChild>
						{renderTrigger ? (
							renderTrigger(open, internalValue)
						) : (
							<button type="button" className="w-full justify-start outline">
								{internalValue ? internalValue.label : placeholder}
							</button>
						)}
					</DrawerTrigger>

					<DrawerContent>
						<div className="mt-4 border-t">
							<RenderCommand
								searchPlaceholder={searchPlaceholder}
								inputValue={inputValue}
								setInputValue={setInputValue}
								filteredOptions={filteredOptions}
								handleSelect={handleSelect}
								handleCreateOption={handleCreateOption}
								hideCreate={hideCreate}
							/>
						</div>
					</DrawerContent>
				</Drawer>
			</>
		);
	}

	return (
		<>
			<input type="hidden" id={id} name={name} value={internalValue?.value || ""} />
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					{renderTrigger ? (
						renderTrigger(open, internalValue)
					) : (
						<button type="button" className="w-full justify-start outline">
							{internalValue ? internalValue.label : placeholder}
						</button>
					)}
				</PopoverTrigger>

				<PopoverContent className="w-auto overflow-hidden p-0" align={align} side={side}>
					<RenderCommand
						searchPlaceholder={searchPlaceholder}
						inputValue={inputValue}
						setInputValue={setInputValue}
						filteredOptions={filteredOptions}
						handleSelect={handleSelect}
						handleCreateOption={handleCreateOption}
					/>
				</PopoverContent>
			</Popover>
		</>
	);
}

function RenderCommand<O extends Option>({
	searchPlaceholder,
	inputValue,
	setInputValue,
	filteredOptions,
	handleSelect,
	handleCreateOption,
	hideCreate,
}: RenderCommandProps<O>) {
	const { t } = useTranslation("common");
	return (
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
	);
}
