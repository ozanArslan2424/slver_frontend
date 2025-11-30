import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover } from "@/components/modals/popover";
import { useLanguage } from "@/modules/language/use-language";
import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";

interface DatePickerProps {
	id?: string;
	name?: string;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	startDate?: Date | undefined;
	endDate?: Date | undefined;
	placeholder?: string;
	className?: string;
	renderTrigger?: (open: boolean, value: Date | undefined) => ReactNode;
}

export function DatePicker({
	id,
	name,
	value,
	defaultValue,
	onChange,
	startDate,
	endDate,
	placeholder,
	className,
	renderTrigger,
}: DatePickerProps) {
	const { timestamp } = useLanguage();
	const [open, onOpenChange] = useState(false);
	const [dateValue, setDateValue] = useState(
		value ? new Date(value) : defaultValue ? new Date(defaultValue) : undefined,
	);

	const handleDateSelect = (selectedDate: Date | undefined) => {
		if (!selectedDate) return;

		const newDateTime = new Date(selectedDate);

		if (onChange) {
			onChange(newDateTime.toISOString());
		}

		setDateValue(newDateTime);
		onOpenChange(false);
	};

	return (
		<>
			<input type="hidden" id={id} name={name} value={dateValue?.toISOString()} />
			<Popover
				id={`${id ?? name}_popover`}
				open={open}
				onOpenChange={onOpenChange}
				defaultOpen={false}
				trigger={(open) =>
					renderTrigger ? (
						renderTrigger(open, dateValue)
					) : (
						<button className={cn("outlined w-full justify-between font-normal", className)}>
							{dateValue
								? timestamp(dateValue).shortDate
								: placeholder
									? placeholder
									: ". . / . . / . . . ."}
							<ChevronDownIcon className={cn("transition-all", open ? "rotate-180" : "rotate-0")} />
						</button>
					)
				}
				className="w-auto overflow-hidden p-0"
				align="start"
			>
				<Calendar
					mode="single"
					selected={dateValue}
					captionLayout="dropdown"
					onSelect={handleDateSelect}
					startMonth={startDate}
					endMonth={endDate}
				/>
			</Popover>
		</>
	);
}
