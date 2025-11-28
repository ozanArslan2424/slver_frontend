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
	const emailLabel = t("register.email.label");
	const nameLabel = t("register.name.label");
	const passwordLabel = t("register.password.label");
	const submitLabel = t("register.submit");

	return (
		<form className="flex flex-col gap-4 px-2 pt-6" {...form.methods}>
			<div className="flex items-center gap-3">
				<div className="squircle xl primary">
					<UserIcon />
				</div>
				<FormField form={form} name="name" id="name">
					<input
						className="ghost"
						autoComplete="name"
						type="text"
						placeholder={nameLabel}
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
						placeholder={emailLabel}
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
						placeholder={passwordLabel}
						required
					/>
				</FormField>
			</div>

			<button type="submit" className="lg">
				{isPending ? <LoaderIcon className="animate-spin" /> : submitLabel}
			</button>
		</form>
	);
}
