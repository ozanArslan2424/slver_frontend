import { ActionDialog } from "@/components/modals/action-dialog";
import { PersonAvatar } from "@/components/ui/person-avatar";
import type { EntityAction } from "@/hooks/use-action-dialog";
import { prefixId } from "@/lib/utils";
import { useLanguage } from "@/modules/language/use-language";
import type { UsePersonModuleReturn } from "@/modules/person/use-person-module";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";

type AssignModalProps = {
	thingModule: UseThingModuleReturn;
	personModule: UsePersonModuleReturn;
	variant: "thing" | "person";
};

export function AssignModal({ personModule, thingModule, variant }: AssignModalProps) {
	const { t, timestamp, makeTranslator } = useLanguage(variant);
	const personList = personModule.listQuery.data ?? [];
	const thingList = thingModule.listQuery.data ?? [];

	const thingT = makeTranslator("thing");

	const thingVariantActions: EntityAction[] = personList.map((person) => ({
		key: prefixId(person.id, "person"),
		label: (
			<div className="flex items-center gap-2">
				<PersonAvatar className="h-7 w-7" person={person} />
				<span>{person.name}</span>
			</div>
		),
		onSelect: () => {
			const thingId = thingModule.active?.id;
			const personId = person.id;
			if (thingId) {
				thingModule.assignMutation.mutate({ thingId, personId });
			}
		},
	}));

	const personVariantActions: EntityAction[] = thingList.map((thing) => ({
		key: prefixId(thing.id, "thing"),
		label: (
			<div className="flex w-full items-start justify-between gap-3">
				<div className="flex flex-1 flex-col">
					<p className="flex-1 pb-2 text-sm font-semibold">{thing.content}</p>

					<p className="text-foreground/70 group-hover:text-accent-foreground group-data-[selected=true]:text-accent-foreground text-xs">
						{thing.assignedTo
							? thingT("detail.fields.assignedTo.somebody", {
									name: thing.assignedTo.name,
								})
							: thingT("detail.fields.assignedTo.nobody")}{" "}
						{thing.dueDate &&
							thingT(`detail.fields.dueDate.${thing.isDone ? "labelDone" : "labelNotDone"}`, {
								date: timestamp(thing.dueDate).fromNow,
							})}
					</p>
				</div>

				<div>
					<PersonAvatar
						person={thing.assignedTo ?? { image: undefined, name: "?" }}
						className="ring-border size-10 font-black ring"
					/>
				</div>
			</div>
		),
		onSelect: () => {
			const personId = personModule.active?.id;
			const thingId = thing.id;
			if (personId) {
				thingModule.assignMutation.mutate({ personId, thingId });
			}
		},
	}));
	const actions = variant === "thing" ? thingVariantActions : personVariantActions;
	const props = variant === "thing" ? thingModule.assignModal : personModule.assignModal;
	const title = t("assign.label");

	return <ActionDialog {...props} title={title} description={title} actions={actions} />;
}
