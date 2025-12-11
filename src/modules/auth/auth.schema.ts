import language from "@/modules/language/language.config";
import type { PersonData } from "@/modules/person/person.schema";
import { z } from "zod/v4";

const translate = (key: string) => language.t(key, { ns: "auth" });

export const AuthLoginSchema = z.object({
	email: z.email(translate("auth.login.email.error")),
	password: z.string().min(8, translate("auth.login.password.error")),
});

export type AuthLoginData = z.infer<typeof AuthLoginSchema>;

export const AuthRegisterSchema = z.object({
	name: z.string().min(1, translate("register.name.error")),
	email: z.email(translate("register.email.error")),
	password: z.string().min(8, translate("register.password.error")),
});

export type AuthRegisterData = z.infer<typeof AuthRegisterSchema>;

export type AuthResponseData = {
	profile: PersonData;
	accessToken: string;
	refreshToken: string;
};

export type ProfileData = PersonData & {
	emailVerified: boolean;
};

export type AuthenticatedData = {
	groupId: number | null;
	accessToken: string | null;
	refreshToken: string | null;
};
