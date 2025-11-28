import { ActionDialog } from "@/components/dialogs/action-dialog";
import { PersonAvatar } from "@/components/ui/person-avatar";
import type { EntityAction } from "@/hooks/use-action-dialog";
import { prefixId } from "@/lib/utils";
import { useLanguage } from "@/modules/language/use-language";
import type { UsePersonModuleReturn } from "@/modules/person/use-person-module";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";

type AssignDialogProps = {
	thingModule: UseThingModuleReturn;
	personModule: UsePersonModuleReturn;
	variant: "thing" | "person";
};

export function AssignDialog({ personModule, thingModule, variant }: AssignDialogProps) {
	const { timestamp } = useLanguage();

	const thingVariantActions: EntityAction[] = (personModule.listQuery.data ?? []).map((person) => ({
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

	const personVariantActions: EntityAction[] = (thingModule.listQuery.data ?? []).map((thing) => ({
		key: prefixId(thing.id, "thing"),
		label: (
			<div className="flex w-full items-start justify-between gap-3">
				<div className="flex flex-1 flex-col">
					<p className="flex-1 pb-2 text-sm font-semibold">{thing.content}</p>

					<p className="text-foreground/70 group-hover:text-accent-foreground group-data-[selected=true]:text-accent-foreground text-xs">
						{thing.assignedTo
							? thingModule.t("detail.fields.assignedTo.somebody", {
									name: thing.assignedTo.name,
								})
							: thingModule.t("detail.fields.assignedTo.nobody")}{" "}
						{thing.dueDate &&
							thingModule.t(
								`detail.fields.dueDate.${thing.isDone ? "labelDone" : "labelNotDone"}`,
								{
									date: timestamp(thing.dueDate).fromNow,
								},
							)}
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
	const props = variant === "thing" ? thingModule.assignDialog : personModule.assignDialog;

	return <ActionDialog {...props} actions={actions} />;
}
