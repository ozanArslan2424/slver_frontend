import { PersonAvatar } from "@/components/ui/person-avatar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/modules/language/use-language";
import type { UsePersonModuleReturn } from "@/modules/person/use-person-module";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { Dialog } from "@/components/modals/dialog";
import type { ComponentProps } from "react";
import type { PersonData } from "@/modules/person/person.schema";
import type { ThingData } from "@/modules/thing/thing.schema";

type AssignModalProps = {
	thingModule: UseThingModuleReturn;
	personModule: UsePersonModuleReturn;
	optionProps: (args: {
		personId: PersonData["id"];
		thingId: ThingData["id"];
	}) => ComponentProps<"button">;
};

export function ThingAssignModal({ personModule, thingModule, optionProps }: AssignModalProps) {
	const { t } = useLanguage("thing");
	const personList = personModule.listQuery.data ?? [];
	const modal = thingModule.assignModal;
	const thing = thingModule.active;

	if (!thing) return null;

	return (
		<Dialog title={t("assign.label")} description={t("assign.label")} {...modal}>
			<div className="flex flex-col gap-2">
				{personList.map((person) => {
					const props = optionProps({ personId: person.id, thingId: thing.id });
					return (
						<button key={person.id} {...props} className={cn("ghost", props.className)}>
							<div className="flex items-center gap-2">
								<PersonAvatar className="h-7 w-7" person={person} />
								<span>{person.name}</span>
							</div>
						</button>
					);
				})}
			</div>
		</Dialog>
	);
}
