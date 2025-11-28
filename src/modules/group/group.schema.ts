import { toBoolean } from "@/lib/utils";
import i18n from "@/modules/language/language.config";
import z from "zod";

export const GroupDataSchema = z.object({
	id: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
	title: z.string(),
});

export type GroupData = z.infer<typeof GroupDataSchema>;

export const GroupCreateSchema = z.object({
	title: z.string().min(1, i18n.t("form.fields.title.error", { ns: "group" })),
});

export type GroupCreateData = z.infer<typeof GroupCreateSchema>;

export const GroupJoinSchema = z.object({
	join: z.string().min(6, i18n.t("form.fields.join.error", { ns: "group" })),
});

export type GroupJoinData = z.infer<typeof GroupJoinSchema>;

export const GroupInviteSchema = z.object({
	email: z.email(),
	role: z.union([z.boolean(), z.enum(["true", "false"]).transform((v) => toBoolean(v))]),
});

export type GroupInviteData = z.infer<typeof GroupInviteSchema>;

export const GroupRemoveSchema = z.object({
	personId: z.number(),
});

export type GroupRemoveData = z.infer<typeof GroupRemoveSchema>;
