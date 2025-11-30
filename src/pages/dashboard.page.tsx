import { PageContent } from "@/components/layout/page-content";
import { useDnd } from "@/hooks/use-dnd";
import { ThingDetailDialog } from "@/components/thing-detail-dialog";
import { ThingForm } from "@/components/thing-form";
import { ThingUpdateDialog } from "@/components/thing-update-dialog";
import { cn, prefixId } from "@/lib/utils";
import { GroupCreateForm } from "@/components/group-create-form";
import { useThingModule } from "@/modules/thing/use-thing-module";
import { usePersonModule } from "@/modules/person/use-person-module";
import { useAuthModule } from "@/modules/auth/use-auth-module";
import { ThingDoneCard } from "@/components/thing-done-card";
import { useGroupModule } from "@/modules/group/use-group-module";
import { ThingList } from "@/components/thing-list";
import { PersonList } from "@/components/person-list";
import { AssignDialog } from "@/components/thing-assign-dialog";
import { useKeyboardModule } from "@/modules/keyboard/use-keyboard-module";
import { ActionDialog } from "@/components/modals/action-dialog";
import { GroupJoinForm } from "@/components/group-join-form";
import { GroupInviteForm } from "@/components/group-invite-form";
import { ThingRemoveDialog } from "@/components/thing-remove-dialog";
import { PersonRemoveDialog } from "@/components/person-remove-dialog";
import { useEffect } from "react";
import type { SlimItem } from "@/modules/keyboard/keyboard.schema";
import { useIsMobile } from "@/hooks/use-mobile";

export function DashboardPage() {
	const isMobile = useIsMobile();
	const authMod = useAuthModule();
	const thingMod = useThingModule();
	const personMod = usePersonModule();
	const groupMod = useGroupModule();

	const keyboardMod = useKeyboardModule();

	useEffect(() => {
		const items: SlimItem[] = [];
		if (authMod.noGroup) {
			items.push({
				id: prefixId("create", "group"),
				actions: [{ keys: ["Enter"], fn: groupMod.createAction }],
			});
		} else {
			items.push({
				id: prefixId("invite", "group"),
				actions: [{ keys: ["Enter"], fn: groupMod.inviteAction }],
			});

			personMod.listQuery.data?.forEach((p) =>
				items.push({
					id: prefixId(p.id, "person"),
					actions: [
						{ keys: ["Enter"], fn: () => personMod.handleAction(p) },
						{ keys: ["x"], fn: () => personMod.handleRemoveClick(p) },
					],
				}),
			);
		}

		items.push({
			id: prefixId("form", "thing"),
			actions: [{ keys: ["Enter"], fn: thingMod.formAction }],
		});

		thingMod.listQuery.data
			?.filter((t) => !t.isDone)
			.sort((a, b) => thingMod.handleSortByDate(a, b, "notDone"))
			.forEach((t) => {
				items.push({
					id: prefixId(t.id, "thing"),
					actions: [
						{
							keys: ["Enter"],
							fn: () => thingMod.handleDetailClick(t),
							items: thingMod.detailItems,
						},
						{ keys: ["Space"], fn: () => thingMod.handleActionClick(t) },
						{ keys: ["c"], fn: () => thingMod.handleDoneClick(t) },
						{ keys: ["u"], fn: () => thingMod.handleUpdateClick(t) },
						{ keys: ["a"], fn: () => thingMod.handleAssignClick(t) },
						{ keys: ["x"], fn: () => thingMod.handleRemoveClick(t), items: thingMod.removeItems },
					],
				});
			});

		thingMod.listQuery.data
			?.filter((t) => t.isDone)
			.sort((a, b) => thingMod.handleSortByDate(a, b, "done"))
			.forEach((t) => {
				items.push({
					id: prefixId(t.id, "thing"),
					actions: [
						{
							keys: ["Enter"],
							fn: () => thingMod.handleDetailClick(t),
							items: thingMod.detailItems,
						},
						{ keys: ["Space"], fn: () => thingMod.handleActionClick(t) },
						{ keys: ["c"], fn: () => thingMod.handleDoneClick(t) },
						{
							keys: ["x"],
							fn: () => thingMod.handleRemoveClick(t),
							items: thingMod.removeItems,
						},
					],
				});
			});

		keyboardMod.setInitialItems(items);
	}, [keyboardMod, personMod, groupMod, thingMod, authMod.noGroup]);

	const dnd = useDnd({
		onDrop: (sourceData, targetData) => {
			const sourceIsPerson = sourceData.sourceId.startsWith("person");
			const sourceIsThing = sourceData.sourceId.startsWith("thing");
			const targetIsThing = targetData.targetId.startsWith("thing");
			const targetIsDone = targetData.targetId === "done";
			const targetIsNotDone = targetData.targetId === "notDone";

			if (sourceIsPerson && targetIsThing) {
				const personId = Number(prefixId(sourceData.sourceId));
				const thingId = Number(prefixId(targetData.targetId));
				const thing = thingMod.find(thingId);
				if (thing?.assignedToId !== personId) {
					thingMod.assignMutation.mutate({ thingId, personId });
				}
			}

			if (sourceIsThing && targetIsDone) {
				const thingId = Number(prefixId(sourceData.sourceId));
				const thing = thingMod.find(thingId);
				if (thing) {
					thingMod.handleDoneClick(thing, true);
				}
			}

			if (sourceIsThing && targetIsNotDone) {
				const thingId = Number(prefixId(sourceData.sourceId));
				const thing = thingMod.find(thingId);
				if (thing) {
					thingMod.handleDoneClick(thing, false);
				}
			}
		},
	});

	return (
		<PageContent>
			<ActionDialog {...thingMod.actionDialog} />
			<ActionDialog {...personMod.actionDialog} />
			<ThingRemoveDialog thingModule={thingMod} keyboardModule={keyboardMod} />
			<PersonRemoveDialog personModule={personMod} />
			<ThingDetailDialog thingModule={thingMod} keyboardModule={keyboardMod} />
			<ThingUpdateDialog thingModule={thingMod} personModule={personMod} />
			<AssignDialog variant="thing" thingModule={thingMod} personModule={personMod} />
			<AssignDialog variant="person" thingModule={thingMod} personModule={personMod} />

			<div className="grid grid-cols-12 gap-8 pb-14">
				<div className="col-span-4 hidden sm:block">
					<div className="flex flex-1 flex-col gap-3">
						<h1
							className={cn(
								"font-bold",
								authMod.noGroup ? "text-foreground/70 text-lg" : "text-xl",
							)}
						>
							{authMod.noGroup
								? groupMod.t("noGroup")
								: personMod.t("titleWithGroup", {
										groupName: groupMod.groupQuery.data?.title,
									})}
						</h1>
						{authMod.noGroup ? (
							<GroupCreateForm groupModule={groupMod} keyboardModule={keyboardMod} />
						) : (
							<div className="flex flex-col gap-3">
								<GroupInviteForm groupModule={groupMod} keyboardModule={keyboardMod} />
								<PersonList personModule={personMod} keyboardModule={keyboardMod} dnd={dnd} />
							</div>
						)}
						{authMod.pendingMemberships && (
							<div className="flex flex-col gap-3">
								{authMod.pendingMemberships.map((m) => (
									<div key={m.groupId}>
										<h1 className="mb-2 text-lg font-bold">
											{groupMod.t("form.fields.join.title", {
												groupName: m.group.title,
											})}
										</h1>
										<GroupJoinForm
											key={m.groupId}
											groupModule={groupMod}
											keyboardModule={keyboardMod}
										/>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				<div className="col-span-12 md:col-span-4">
					<div className="flex flex-1 flex-col gap-3">
						<h1 className="text-xl font-bold">{thingMod.t("title")}</h1>
						<ThingForm thingModule={thingMod} keyboardModule={keyboardMod} />
						<ThingDoneCard
							thingModule={thingMod}
							dnd={dnd}
							variant={isMobile ? "done" : "notDone"}
						/>
						<ThingList
							thingModule={thingMod}
							keyboardModule={keyboardMod}
							dnd={dnd}
							variant="notDone"
						/>
					</div>
				</div>

				<div className="col-span-12 md:col-span-4">
					<div className="flex flex-1 flex-col gap-3">
						<h1 className="text-xl font-bold">{thingMod.t("done.title")}</h1>
						<ThingDoneCard
							thingModule={thingMod}
							dnd={dnd}
							variant={isMobile ? "notDone" : "done"}
						/>
						<ThingList
							thingModule={thingMod}
							keyboardModule={keyboardMod}
							dnd={dnd}
							variant="done"
						/>
					</div>
				</div>
			</div>
		</PageContent>
	);
}
