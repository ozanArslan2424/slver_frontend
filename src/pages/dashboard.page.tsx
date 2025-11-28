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
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { ActionDialog } from "@/components/dialogs/action-dialog";
import { GroupJoinForm } from "@/components/group-join-form";
import { GroupInviteForm } from "@/components/group-invite-form";
import { ThingRetryCard } from "@/components/thing-retry-card";

export function DashboardPage() {
	const authModule = useAuthModule();
	const thingModule = useThingModule();
	const personModule = usePersonModule();
	const groupModule = useGroupModule();
	const keyboardModule = useKeyboardModule(
		thingModule.detailDialog.open
			? thingModule.els.detail
			: [
					...(authModule.noGroup
						? [groupModule.els.noGroup]
						: [groupModule.els.yesGroup, ...personModule.els]),
					...thingModule.els.form,
					...thingModule.els.notDone,
					...thingModule.els.done,
				],
	);

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
				const thing = thingModule.find(thingId);
				if (thing?.assignedToId !== personId) {
					thingModule.assignMutation.mutate({ thingId, personId });
				}
			}

			if (sourceIsThing && targetIsDone) {
				const thingId = Number(prefixId(sourceData.sourceId));
				const thing = thingModule.find(thingId);
				if (thing) {
					thingModule.handleDoneClick(thing);
				}
			}

			if (sourceIsThing && targetIsNotDone) {
				const thingId = Number(prefixId(sourceData.sourceId));
				const thing = thingModule.find(thingId);
				if (thing) {
					thingModule.handleNotDoneClick(thing);
				}
			}
		},
	});

	return (
		<PageContent>
			<ActionDialog {...thingModule.actionDialog} />
			<ActionDialog {...personModule.actionDialog} />
			<ConfirmDialog {...thingModule.removeDialog} />
			<ConfirmDialog {...personModule.removeDialog} />
			<ThingDetailDialog thingModule={thingModule} keyboardModule={keyboardModule} />
			<ThingUpdateDialog thingModule={thingModule} personModule={personModule} />
			<AssignDialog variant="thing" thingModule={thingModule} personModule={personModule} />
			<AssignDialog variant="person" thingModule={thingModule} personModule={personModule} />

			<div className="grid grid-cols-12 gap-8 pb-20">
				<div className="col-span-4 hidden sm:block">
					<div className="flex flex-1 flex-col gap-3">
						<h1
							className={cn(
								"font-bold",
								authModule.noGroup ? "text-foreground/70 text-lg" : "text-xl",
							)}
						>
							{authModule.noGroup
								? groupModule.t("noGroup")
								: personModule.t("titleWithGroup", {
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
											{groupModule.t("form.fields.join.title", {
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
						<h1 className="text-xl font-bold">{thingModule.t("title")}</h1>
						<ThingForm thingModule={thingModule} keyboardModule={keyboardModule} />
						<ThingRetryCard thingModule={thingModule} />
						<ThingDoneCard thingModule={thingModule} dnd={dnd} variant="notDone" />
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
						<h1 className="text-xl font-bold">{thingModule.t("done.title")}</h1>
						<ThingDoneCard thingModule={thingModule} dnd={dnd} variant="done" />
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
