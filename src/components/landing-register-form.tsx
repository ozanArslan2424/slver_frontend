import { FormField } from "@/components/form/form-field";
import type { UseAuthModuleReturn } from "@/modules/auth/use-auth-module";
import { UserIcon, AtSignIcon, AsteriskIcon, LoaderIcon } from "lucide-react";

type LandingRegisterFormProps = {
	authModule: UseAuthModuleReturn;
};

export function LandingRegisterForm({ authModule }: LandingRegisterFormProps) {
	const t = authModule.t;
	const form = authModule.registerForm;
	const isPending = authModule.registerForm.isPending;

	return (
		<form className="flex flex-col gap-3 px-2 pt-6 sm:gap-4" {...form.methods}>
			<div className="flex items-center gap-3">
				<div className="squircle xl primary">
					<UserIcon />
				</div>
				<FormField form={form} name="name" id="name">
					<input
						className="ghost"
						autoComplete="name"
						type="text"
						placeholder={t("register.name.label")}
						required
					/>
				</FormField>
			</div>

			<div className="flex items-center gap-3">
				<div className="squircle xl primary">
					<AtSignIcon className="size-6" />
				</div>
				<FormField form={form} name="email" id="email">
					<input
						className="ghost"
						autoComplete="email"
						type="email"
						placeholder={t("register.email.label")}
						required
					/>
				</FormField>
			</div>

			<div className="flex items-center gap-3">
				<div className="squircle xl primary">
					<AsteriskIcon />
				</div>
				<FormField form={form} name="password" id="password">
					<input
						className="ghost"
						autoComplete="new-password"
						type="password"
						placeholder={t("register.password.label")}
						required
					/>
				</FormField>
			</div>

			<button type="submit" className="lg">
				{isPending ? <LoaderIcon className="animate-spin" /> : t("register.submit")}
			</button>
		</form>
	);
}
