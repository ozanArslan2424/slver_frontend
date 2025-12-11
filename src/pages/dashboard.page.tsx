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
import { PersonAssignModal } from "@/components/person-assign-dialog";
import { useKeyboardModule } from "@/modules/keyboard/use-keyboard-module";
import { GroupJoinForm } from "@/components/group-join-form";
import { GroupInviteForm } from "@/components/group-invite-form";
import { ThingRemoveModal } from "@/components/thing-remove-modal";
import { PersonRemoveModal } from "@/components/person-remove-modal";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ThingData } from "@/modules/thing/thing.schema";
import { useLanguage } from "@/modules/language/use-language";
import { PersonDetailModal } from "@/components/person-detail-modal";
import type { PersonData } from "@/modules/person/person.schema";
import { ThingAssignModal } from "@/components/thing-assign-dialog";
import { Dialog } from "@/components/modals/dialog";

type KeyboardDispatch =
	| { fn: "click" }
	| { fn: "assign"; payload: { personId: PersonData["id"]; thingId: PersonData["id"] } }
	| {
			fn:
				| "thing_item_assign"
				| "thing_item_detail"
				| "thing_item_menu"
				| "thing_item_status"
				| "thing_item_update"
				| "thing_item_remove";
			payload: ThingData["id"];
	  }
	| {
			fn: "person_item_menu" | "person_item_remove" | "person_item_assign";
			payload: PersonData["id"];
	  };

export function DashboardPage() {
	const { makeTranslator } = useLanguage();
	const isMobile = useIsMobile();
	const authModule = useAuthModule();
	const thingModule = useThingModule();
	const personModule = usePersonModule();
	const groupModule = useGroupModule();

	const thingT = makeTranslator("thing");
	const personT = makeTranslator("person");
	const groupT = makeTranslator("group");

	const registerVisualItem = useKeyboardModule<KeyboardDispatch>((action, el) => {
		switch (action.fn) {
			case "assign":
				thingModule.handleAssign(action.payload);
				break;
			case "person_item_menu":
				personModule.handleOpenDetailModal(action.payload);
				break;
			case "person_item_assign":
				personModule.handleOpenAssignModal(action.payload);
				break;
			case "person_item_remove":
				personModule.handleOpenRemoveModal(action.payload);
				break;
			case "thing_item_update":
				thingModule.handleOpenUpdateModal(action.payload);
				break;
			case "thing_item_remove":
				thingModule.handleOpenRemoveModal(action.payload);
				break;
			case "thing_item_menu":
				thingModule.handleOpenMenuModal(action.payload);
				break;
			case "thing_item_status":
				thingModule.handleUpdateStatus(action.payload);
				break;
			case "thing_item_assign":
				thingModule.handleOpenAssignModal(action.payload);
				break;
			case "click":
			default:
				el.activate?.();
				break;
		}
	});

	const dnd = useDnd({
		onDrop: (source, target) => {
			const sourceIsPerson = source.sourceId.startsWith("person");
			const sourceIsThing = source.sourceId.startsWith("thing");
			const targetIsThing = target.targetId.startsWith("thing");
			const targetIsDone = target.targetId === "done";

			if (sourceIsPerson && targetIsThing) {
				const personId = Number(prefixId(source.sourceId));
				const thingId = Number(prefixId(target.targetId));
				const thing = thingModule.find(thingId);
				if (thing?.assignedToId !== personId) {
					thingModule.handleAssign({ thingId, personId });
				}
			}

			if (sourceIsThing) {
				const thingId = Number(prefixId(source.sourceId));
				thingModule.handleUpdateStatus(thingId, targetIsDone);
			}
		},
	});

	return (
		<PageContent>
			<PersonDetailModal personModule={personModule} authModule={authModule} />
			<PersonRemoveModal
				personModule={personModule}
				confirmProps={registerVisualItem("person_remove_confirm", { Enter: { fn: "click" } })}
				cancelProps={registerVisualItem("person_remove_cancel", { Enter: { fn: "click" } })}
			/>
			<PersonAssignModal
				thingModule={thingModule}
				personModule={personModule}
				optionProps={({ personId, thingId }) =>
					registerVisualItem(`person_assign_${personId}_${thingId}`, {
						Enter: { fn: "assign", payload: { personId, thingId } },
					})
				}
			/>

			<ThingRemoveModal
				thingModule={thingModule}
				confirmProps={registerVisualItem("thing_remove_confirm", { Enter: { fn: "click" } })}
				cancelProps={registerVisualItem("thing_remove_cancel", { Enter: { fn: "click" } })}
			/>
			<ThingDetailModal
				thingModule={thingModule}
				removeProps={registerVisualItem("thing_remove_button", { Enter: { fn: "click" } })}
				updateProps={registerVisualItem("thing_update_button", { Enter: { fn: "click" } })}
				statusProps={registerVisualItem("thing_status_button", { Enter: { fn: "click" } })}
				assignProps={registerVisualItem("thing_assign_button", { Enter: { fn: "click" } })}
			/>

			<ThingAssignModal
				thingModule={thingModule}
				personModule={personModule}
				optionProps={({ personId, thingId }) =>
					registerVisualItem(`thing_assign_${personId}_${thingId}`, {
						Enter: { fn: "assign", payload: { personId, thingId } },
					})
				}
			/>
			<ThingUpdateModal
				thingModule={thingModule}
				personModule={personModule}
				textareaProps={registerVisualItem("thing_update_content", { Enter: { fn: "click" } })}
				datepickerProps={registerVisualItem("thing_update_dueDate", { Enter: { fn: "click" } })}
				comboboxProps={registerVisualItem("thing_update_assignedToId", { Enter: { fn: "click" } })}
				cancelProps={registerVisualItem("thing_update_cancel", { Enter: { fn: "click" } })}
				submitProps={registerVisualItem("thing_update_submit", { Enter: { fn: "click" } })}
			/>

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
							<GroupCreateForm
								groupModule={groupModule}
								inputProps={registerVisualItem("group_create_input", { Enter: { fn: "click" } })}
								submitProps={registerVisualItem("group_create_submit", { Enter: { fn: "click" } })}
							/>
						) : (
							<div className="flex flex-col gap-3">
								<div className="flex items-center gap-3">
									<button className="soft w-full">Update Group</button>
									<button
										onClick={() => groupModule.inviteModal.onOpenChange(true)}
										{...registerVisualItem(
											"group_invite_trigger",
											{ Enter: { fn: "click" } },
											"soft w-full",
										)}
									>
										Invite
									</button>
								</div>

								<Dialog title="" description="" {...groupModule.inviteModal}>
									<GroupInviteForm
										groupModule={groupModule}
										inputProps={registerVisualItem("group_invite_input", {
											Enter: { fn: "click" },
										})}
										checkboxProps={registerVisualItem("group_invite_checkbox", {
											Enter: { fn: "click" },
										})}
										submitProps={registerVisualItem("group_invite_submit", {
											Enter: { fn: "click" },
										})}
									/>
								</Dialog>
								<PersonList
									personModule={personModule}
									dnd={dnd}
									cardProps={({ id }) =>
										registerVisualItem(`person_item_${id}`, {
											Enter: { fn: "person_item_menu", payload: id },
											x: { fn: "person_item_remove", payload: id },
											a: { fn: "person_item_assign", payload: id },
										})
									}
								/>
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
											inputProps={registerVisualItem("group_join_input", {
												Enter: { fn: "click" },
											})}
											submitProps={registerVisualItem("group_join_submit", {
												Enter: { fn: "click" },
											})}
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
						<ThingForm
							thingModule={thingModule}
							textareaProps={registerVisualItem("thing_create_content", { Enter: { fn: "click" } })}
							datePickerProps={registerVisualItem("thing_create_dueDate", {
								Enter: { fn: "click" },
							})}
							submitProps={registerVisualItem("thing_create_submit", { Enter: { fn: "click" } })}
						/>
						<ThingStatusCard dnd={dnd} variant={isMobile ? "done" : "notDone"} />
						<ThingList
							thingModule={thingModule}
							dnd={dnd}
							variant="notDone"
							cardProps={({ id }) =>
								registerVisualItem(`thing_item_${id}`, {
									Enter: { fn: "thing_item_detail", payload: id },
									Space: { fn: "thing_item_menu", payload: id },
									c: { fn: "thing_item_status", payload: id },
									a: { fn: "thing_item_assign", payload: id },
									u: { fn: "thing_item_update", payload: id },
									x: { fn: "thing_item_remove", payload: id },
								})
							}
						/>
					</div>
				</div>

				<div className="col-span-12 md:col-span-4">
					<div className="flex flex-1 flex-col gap-3">
						<h1 className="text-xl font-bold">{thingT("done.title")}</h1>
						<ThingStatusCard dnd={dnd} variant={isMobile ? "notDone" : "done"} />
						<ThingList
							thingModule={thingModule}
							dnd={dnd}
							variant="done"
							cardProps={({ id }) =>
								registerVisualItem(`thing_item_${id}`, {
									Enter: { fn: "thing_item_detail", payload: id },
									Space: { fn: "thing_item_menu", payload: id },
									c: { fn: "thing_item_status", payload: id },
									x: { fn: "thing_item_remove", payload: id },
								})
							}
						/>
					</div>
				</div>
			</div>
		</PageContent>
	);
}
