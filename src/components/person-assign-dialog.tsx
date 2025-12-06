import { cn } from "@/lib/utils";
import { useLanguage } from "@/modules/language/use-language";
import type { UsePersonModuleReturn } from "@/modules/person/use-person-module";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { Dialog } from "@/components/modals/dialog";
import type { ComponentProps } from "react";
import type { PersonData } from "@/modules/person/person.schema";
import type { ThingData } from "@/modules/thing/thing.schema";
import { ThingCard } from "@/components/thing-card";

type AssignModalProps = {
	thingModule: UseThingModuleReturn;
	personModule: UsePersonModuleReturn;
	optionProps: (args: {
		personId: PersonData["id"];
		thingId: ThingData["id"];
	}) => ComponentProps<"div">;
};

export function PersonAssignModal({ personModule, thingModule, optionProps }: AssignModalProps) {
	const { t } = useLanguage("person");
	const thingList = thingModule.listQuery.data ?? [];
	const modal = personModule.assignModal;
	const person = personModule.active;

	if (!person) return null;

	return (
		<Dialog showTitle title={t("assign.label")} description={t("assign.label")} {...modal}>
			<div className="h-full max-h-96 space-y-3 overflow-y-auto p-1">
				{thingList.map((thing) => {
					const props = optionProps({ personId: person.id, thingId: thing.id });
					return (
						<ThingCard
							key={thing.id}
							thing={thing}
							{...props}
							className={cn("cursor-pointer active:cursor-pointer", props.className)}
						/>
					);
				})}
			</div>
		</Dialog>
	);
}
