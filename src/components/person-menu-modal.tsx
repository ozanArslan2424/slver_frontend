import { Popover } from "@/components/modals/popover";
import type { UseAuthModuleReturn } from "@/modules/auth/use-auth-module";
import { useLanguage } from "@/modules/language/use-language";
import type { UsePersonModuleReturn } from "@/modules/person/use-person-module";

type PersonMenuModalProps = {
	personModule: UsePersonModuleReturn;
	authModule: UseAuthModuleReturn;
};

export function PersonMenuModal({ personModule, authModule }: PersonMenuModalProps) {
	const { t } = useLanguage("person");
	const modal = personModule.menuModal;
	const assignAction = personModule.assignAction;
	const removeAction = personModule.removeAction;
	const person = personModule.active;
	const meQuery = authModule.meQuery;

	// {
	// 		actions: [
	// 			{
	// 				key: "assign",
	// 				label: t("assign.label"),
	// 				onSelect: () => assignAction(),
	// 			},
	// 			...(person.active?.id === meQuery.data?.id
	// 				? []
	// 				: [{ key: "remove", label: t("remove.label"), onSelect: () => removeAction() }]),
	// 		],
	// 	}
	return (
		<Popover {...modal}>
			<button onClick={() => assignAction()}>{t("assign.label")}</button>
			{person?.id !== meQuery.data?.id && (
				<button onClick={() => removeAction()}>{t("remove.label")}</button>
			)}
		</Popover>
	);
}
