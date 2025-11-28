import { FormField } from "@/components/form/form-field";
import { FormRootError } from "@/components/form/form-root-error";
import { clientRoutes } from "@/client.routes";
import { useAuthModule } from "@/modules/auth/use-auth-module";
import { AsteriskIcon, AtSignIcon, LoaderIcon, UserIcon } from "lucide-react";
import { Link } from "react-router";

export function RegisterPage() {
	const authModule = useAuthModule();

	const t = authModule.t;
	const form = authModule.registerForm;
	const isPending = authModule.registerMutation.isPending;
	const title = t("register.title");
	const emailLabel = t("register.email.label");
	const nameLabel = t("register.name.label");
	const passwordLabel = t("register.password.label");
	const submitLabel = t("register.submit");
	const backToLoginLabel = t("register.haveAccount");

	return (
		<>
			<header>
				<h1>{title}</h1>
			</header>

			<form className="flex flex-col gap-6" {...form.methods}>
				<FormRootError form={form} />

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

				<button type="submit" className="lg w-full" disabled={isPending}>
					{isPending ? <LoaderIcon className="animate-spin" /> : submitLabel}
				</button>
			</form>

			<footer className="space-y-1">
				<Link
					to={clientRoutes.login}
					className="text-foreground/70 hover:text-foreground block text-center text-sm transition-all"
				>
					{backToLoginLabel}
				</Link>
			</footer>
		</>
	);
}
