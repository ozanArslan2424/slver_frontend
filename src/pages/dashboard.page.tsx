import { PageContent } from "@/components/layout/page-content";
import { useDnd } from "@/hooks/use-dnd";
import { ThingDetailModal } from "@/components/thing-detail-modal";
import { ThingForm } from "@/components/thing-form";
import { ThingUpdateModal } from "@/components/thing-update-modal";
import { cn, prefixId } from "@/lib/utils";
import { GroupCreateForm } from "@/components/group-create-form";
import { useThingModule } from "@/modules/thing/use-thing-module";
import { usePersonModule } from "@/modules/person/use-person-module";
import { useAuthModule } from "@/modules/auth/use-auth-module";
import { ThingStatusCard } from "@/components/thing-status-card";
import { useGroupModule } from "@/modules/group/use-group-module";
import { ThingList } from "@/components/thing-list";
import { PersonList } from "@/components/person-list";
import { AssignModal } from "@/components/assign-dialog";
import { useKeyboardModule } from "@/modules/keyboard/use-keyboard-module";
import { GroupJoinForm } from "@/components/group-join-form";
import { GroupInviteForm } from "@/components/group-invite-form";
import { ThingRemoveModal } from "@/components/thing-remove-modal";
import { PersonRemoveModal } from "@/components/person-remove-modal";
import { useEffect } from "react";
import type { SlimItem } from "@/modules/keyboard/keyboard.schema";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ThingData } from "@/modules/thing/thing.schema";
import { useLanguage } from "@/modules/language/use-language";
import { PersonMenuModal } from "@/components/person-menu-modal";

export function DashboardPage() {
	const { makeTranslator } = useLanguage();
	const isMobile = useIsMobile();
	const authModule = useAuthModule();
	const thingModule = useThingModule();
	const personModule = usePersonModule();
	const groupModule = useGroupModule();
	const keyboardModule = useKeyboardModule();

	const thingT = makeTranslator("thing");
	const personT = makeTranslator("person");
	const groupT = makeTranslator("group");

	// TODO: REMAKE THE ACTIONS TO USE KEYS INSTEAD OF ANON FUNCTIONS
	useEffect(() => {
		if (personModule.listQuery.data && thingModule.listQuery.data) {
			const items: SlimItem[] = [];

			if (authModule.noGroup) {
				items.push({
					id: prefixId("create", "group"),
					actions: [{ keys: ["Enter"], fn: groupModule.createAction }],
				} satisfies SlimItem);
			} else {
				items.push({
					id: prefixId("invite", "group"),
					actions: [{ keys: ["Enter"], fn: groupModule.inviteAction }],
				} satisfies SlimItem);

				items.push(
					...personModule.listQuery.data.map(
						(p) =>
							({
								id: prefixId(p.id, "person"),
								actions: [
									{ keys: ["Enter"], fn: () => personModule.menuAction(p) },
									{ keys: ["x"], fn: () => personModule.removeAction(p) },
								],
							}) satisfies SlimItem,
					),
				);
			}

			items.push({
				id: prefixId("form", "thing"),
				actions: [
					{
						keys: ["Enter"],
						fn: () => thingModule.formAction,
						items: [
							{
								id: prefixId("content", "thing_form"),
								actions: [
									{
										keys: ["Enter", "Space"],
										fn: (el) => {
											el.focus();
										},
									},
								],
							},
							{
								id: prefixId("dueDate", "thing_form"),
								actions: [
									{
										keys: ["Enter", "Space"],
										fn: (el) => {
											el.click();
										},
									},
								],
							},
						],
						rangeId: prefixId("form", "thing"),
					},
				],
			} satisfies SlimItem);

			const updateItems = [
				{
					id: prefixId("content", "thing_update_modal"),
					actions: [
						{
							keys: ["Enter", "Space"],
							fn: (el) => {
								el.focus();
							},
						},
					],
				},
				{
					id: prefixId("dueDate", "thing_update_modal"),
					actions: [
						{
							keys: ["Enter", "Space"],
							fn: (el) => {
								el.click();
							},
						},
					],
				},
				{
					id: prefixId("assignedToId", "thing_update_modal"),
					actions: [
						{
							keys: ["Enter", "Space"],
							fn: (el) => {
								el.click();
							},
						},
					],
				},
			] satisfies SlimItem[];

			const removeItems = (t: ThingData): SlimItem[] =>
				[
					{
						id: prefixId("confirm", "thing_remove"),
						actions: [{ keys: ["Enter"], fn: () => thingModule.removeConfirmAction(t) }],
					},
					{
						id: prefixId("cancel", "thing_remove"),
						actions: [{ keys: ["Enter"], fn: thingModule.removeCancelAction }],
					},
				] satisfies SlimItem[];

			const detailItems = (t: ThingData) =>
				[
					{
						id: prefixId("update", "thing_detail"),
						actions: [
							{
								keys: ["Enter", "Space"],
								fn: () => thingModule.updateAction,
								items: updateItems,
								rangeId: thingModule.updateModal.id,
							},
						],
					},
					{
						id: prefixId("remove", "thing_detail"),
						actions: [
							{
								keys: ["Enter", "Space"],
								fn: () => thingModule.removeAction(t),
								items: removeItems(t),
								rangeId: thingModule.removeModal.id,
							},
						],
					},
				] satisfies SlimItem[];

			// not done things are first
			items.push(
				...thingModule.listQuery.data
					.sort((a, b) => Number(a.isDone) - Number(b.isDone))
					.map(
						(t) =>
							({
								id: prefixId(t.id, "thing"),
								actions: [
									{
										keys: ["Enter"],
										fn: () => thingModule.detailOpenAction(t),
										items: detailItems(t),
										rangeId: thingModule.detailModal.id,
									},
									{ keys: ["Space"], fn: () => thingModule.menuAction(t) },
									{ keys: ["c"], fn: () => thingModule.statusAction(t) },
									{
										keys: ["x"],
										fn: () => thingModule.removeAction(t),
										items: removeItems(t),
										rangeId: thingModule.removeModal.id,
									},
								],
							}) satisfies SlimItem,
					),
			);

			keyboardModule.setInitialItems(items);
		}
	}, [keyboardModule, personModule, groupModule, thingModule, authModule.noGroup]);

	const dnd = useDnd({
		onDrop: (source, target) => {
			const sourceIsPerson = source.sourceId.startsWith("person");
			const sourceIsThing = source.sourceId.startsWith("thing");
			const targetIsThing = target.targetId.startsWith("thing");
			const targetIsDone = target.targetId === "done";
			const targetIsNotDone = target.targetId === "notDone";

			if (sourceIsPerson && targetIsThing) {
				const personId = Number(prefixId(source.sourceId));
				const thingId = Number(prefixId(target.targetId));
				const thing = thingModule.find(thingId);
				if (thing?.assignedToId !== personId) {
					thingModule.assignMutation.mutate({ thingId, personId });
				}
			}

			if (sourceIsThing && targetIsDone) {
				const thingId = Number(prefixId(source.sourceId));
				const thing = thingModule.find(thingId);
				if (thing) {
					thingModule.statusAction(thing, true);
				}
			}

			if (sourceIsThing && targetIsNotDone) {
				const thingId = Number(prefixId(source.sourceId));
				const thing = thingModule.find(thingId);
				if (thing) {
					thingModule.statusAction(thing, false);
				}
			}
		},
	});

	return (
		<PageContent>
			<PersonMenuModal personModule={personModule} authModule={authModule} />
			<PersonRemoveModal personModule={personModule} />
			<AssignModal variant="person" thingModule={thingModule} personModule={personModule} />

			<ThingRemoveModal thingModule={thingModule} keyboardModule={keyboardModule} />
			<ThingDetailModal thingModule={thingModule} keyboardModule={keyboardModule} />
			<ThingUpdateModal
				thingModule={thingModule}
				personModule={personModule}
				keyboardModule={keyboardModule}
			/>
			<AssignModal variant="thing" thingModule={thingModule} personModule={personModule} />

			<div className="grid grid-cols-12 gap-8 pb-14">
				<div className="col-span-4 hidden sm:block">
					<div className="flex flex-1 flex-col gap-3">
						<h1
							className={cn(
								"font-bold",
								authModule.noGroup ? "text-foreground/70 text-lg" : "text-xl",
							)}
						>
							{authModule.noGroup
								? groupT("noGroup")
								: personT("titleWithGroup", {
										groupName: groupModule.groupQuery.data?.title,
									})}
						</h1>
						{authModule.noGroup ? (
							<GroupCreateForm groupModule={groupModule} keyboardModule={keyboardModule} />
						) : (
							<div className="flex flex-col gap-3">
								<GroupInviteForm groupModule={groupModule} keyboardModule={keyboardModule} />
								<PersonList personModule={personModule} keyboardModule={keyboardModule} dnd={dnd} />
							</div>
						)}
						{authModule.pendingMemberships && (
							<div className="flex flex-col gap-3">
								{authModule.pendingMemberships.map((m) => (
									<div key={m.groupId}>
										<h1 className="mb-2 text-lg font-bold">
											{groupT("form.fields.join.title", {
												groupName: m.group.title,
											})}
										</h1>
										<GroupJoinForm
											key={m.groupId}
											groupModule={groupModule}
											keyboardModule={keyboardModule}
										/>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				<div className="col-span-12 md:col-span-4">
					<div className="flex flex-1 flex-col gap-3">
						<h1 className="text-xl font-bold">{thingT("title")}</h1>
						<ThingForm thingModule={thingModule} keyboardModule={keyboardModule} />
						<ThingStatusCard dnd={dnd} variant={isMobile ? "done" : "notDone"} />
						<ThingList
							thingModule={thingModule}
							keyboardModule={keyboardModule}
							dnd={dnd}
							variant="notDone"
						/>
					</div>
				</div>

				<div className="col-span-12 md:col-span-4">
					<div className="flex flex-1 flex-col gap-3">
						<h1 className="text-xl font-bold">{thingT("done.title")}</h1>
						<ThingStatusCard dnd={dnd} variant={isMobile ? "notDone" : "done"} />
						<ThingList
							thingModule={thingModule}
							keyboardModule={keyboardModule}
							dnd={dnd}
							variant="done"
						/>
					</div>
				</div>
			</div>
		</PageContent>
	);
}
