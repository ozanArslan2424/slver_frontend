import { FormField } from "@/components/form/form-field";
import { clientRoutes } from "@/client.routes";
import { AsteriskIcon, AtSignIcon, LoaderIcon } from "lucide-react";
import { Link } from "react-router";
import { useAuthModule } from "@/modules/auth/use-auth-module";
import { FormRootError } from "@/components/form/form-root-error";

export function LoginPage() {
	const authModule = useAuthModule();
	const t = authModule.t;
	const form = authModule.loginForm;
	const isPending = authModule.loginMutation.isPending;

	const title = t("login.title");
	const emailLabel = t("login.email.label");
	const passwordLabel = t("login.password.label");
	const forgotPasswordLabel = t("login.forgotPassword");
	const submitLabel = t("login.submit");
	const registerLabel = t("login.noAccount");

	return (
		<>
			<header>
				<h1>{title}</h1>
			</header>

			<form className="flex flex-col gap-6" {...form.methods}>
				<FormRootError form={form} />

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
					to={clientRoutes.forgotPassword}
					className="text-foreground/70 hover:text-foreground block text-center text-sm transition-all"
				>
					{forgotPasswordLabel}
				</Link>

				<Link
					to={clientRoutes.register}
					className="text-foreground/70 hover:text-foreground block text-center text-sm transition-all"
				>
					{registerLabel}
				</Link>
			</footer>
		</>
	);
}
