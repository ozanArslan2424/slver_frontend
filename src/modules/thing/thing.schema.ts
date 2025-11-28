import type { TMaybe } from "@/lib/helper.type";
import i18n from "@/modules/language/language.config";
import type { PersonData } from "@/modules/person/person.schema";
import z from "zod";

export type ThingData = {
	id: number;
	createdAt: string;
	updatedAt: TMaybe<string>;
	content: string;
	isDone: boolean;
	doneDate: TMaybe<string>;
	dueDate: TMaybe<string>;
	assignedToId: TMaybe<number>;
	createdById: number;
	assignedTo: PersonData | null;

	_placeholder?: boolean;
};

export const ThingCreateSchema = z.object({
	content: z.string().min(1, i18n.t("form.fields.title.error", { ns: "thing" })),
	dueDate: z
		.string()
		.optional()
		.transform((v) => (v ? new Date(v).toISOString() : null)),
	assignedToId: z.coerce.number().optional(),
});

export type ThingCreateData = z.infer<typeof ThingCreateSchema>;

export const ThingUpdateSchema = ThingCreateSchema.extend({
	thingId: z.number(),
});

export type ThingUpdateData = z.infer<typeof ThingUpdateSchema>;

export const ThingAssignSchema = z.object({
	thingId: z.number(),
	personId: z.number(),
});

export type ThingAssignData = z.infer<typeof ThingAssignSchema>;

export const ThingRemoveSchema = z.object({
	thingId: z.number(),
});

export type ThingRemoveData = z.infer<typeof ThingRemoveSchema>;

export const ThingDoneSchema = z.object({
	thingId: z.number(),
	isDone: z.boolean(),
});

export type ThingDoneData = z.infer<typeof ThingDoneSchema>;
