import { GroupDataSchema } from "@/modules/group/group.schema";
import z from "zod";

export enum PersonRoleEnum {
	super_admin = "super_admin",
	admin = "admin",
	user = "user",
}

export enum Status {
	pending = "pending",
	accepted = "accepted",
	rejected = "rejected",
}

export const MembershipDataSchema = z.object({
	groupId: z.number(),
	personId: z.number(),
	role: z.enum(PersonRoleEnum),
	status: z.enum(Status),
});

export type MembershipData = z.infer<typeof MembershipDataSchema>;

export const PersonDataSchema = z.object({
	id: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
	name: z.string(),
	email: z.string(),
	image: z.string().nullish(),
	role: z.enum(PersonRoleEnum),
	userId: z.string(),
	memberships: MembershipDataSchema.extend({
		group: GroupDataSchema,
	}).array(),
});

export type PersonData = z.infer<typeof PersonDataSchema>;
