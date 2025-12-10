import { Popover } from "@/components/modals/popover";
import type { UseAuthModuleReturn } from "@/modules/auth/use-auth-module";
import { useLanguage } from "@/modules/language/use-language";
import type { UsePersonModuleReturn } from "@/modules/person/use-person-module";

type PersonDetailModalProps = {
	personModule: UsePersonModuleReturn;
	authModule: UseAuthModuleReturn;
};

export function PersonDetailModal({ personModule, authModule }: PersonDetailModalProps) {
	const { t } = useLanguage("person");
	const modal = personModule.detailModal;
	const handleOpenAssignModal = personModule.handleOpenAssignModal;
	const handleOpenRemoveModal = personModule.handleOpenRemoveModal;
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

	if (!person) return null;
	return (
		<Popover {...modal}>
			<button onClick={() => handleOpenAssignModal(person.id)}>{t("assign.label")}</button>
			{person?.id !== meQuery.data?.id && (
				<button onClick={() => handleOpenRemoveModal(person.id)}>{t("remove.label")}</button>
			)}
		</Popover>
	);
}
