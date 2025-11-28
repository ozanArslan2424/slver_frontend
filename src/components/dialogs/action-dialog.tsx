import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import type { UseActionDialogReturn } from "@/hooks/use-action-dialog";
import { useLanguage } from "@/modules/language/use-language";

export function ActionDialog({ actions, ...rest }: UseActionDialogReturn) {
	const { t } = useLanguage("common");

	return (
		<CommandDialog showCloseButton={false} {...rest}>
			<CommandInput placeholder={t("searchPlaceholder")} />
			<CommandList>
				<CommandEmpty>{t("noResults")}</CommandEmpty>
				<CommandGroup>
					{actions.map((action) => (
						<CommandItem
							key={action.key}
							value={action.key}
							onSelect={(key) => {
								rest.onOpenChange?.(false);
								action.onSelect(key);
							}}
							className="flex items-center justify-between"
						>
							{typeof action.label === "string" ? <span>{action.label}</span> : action.label}
						</CommandItem>
					))}

					<CommandItem
						value="close"
						onSelect={() => {
							rest.onOpenChange?.(false);
						}}
						className="flex items-center justify-between"
					>
						<span>{t("close")}</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
