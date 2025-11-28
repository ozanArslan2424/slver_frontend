import { clientRoutes } from "@/client.routes";
import { FormField } from "@/components/form/form-field";
import { LandingRegisterForm } from "@/components/landing-register-form";
import { AppHeader } from "@/components/layout/app-header";
import { useAuthModule } from "@/modules/auth/use-auth-module";
import { useLanguage } from "@/modules/language/use-language";
import {
	AppWindowIcon,
	AsteriskIcon,
	AtSignIcon,
	CircleSlashIcon,
	ClipboardIcon,
	Clock9Icon,
	GroupIcon,
	LoaderIcon,
	PersonStandingIcon,
	SquareDashed,
	TargetIcon,
	UserIcon,
} from "lucide-react";
import { Link } from "react-router";

export function LandingPage() {
	const { makeTranslator } = useLanguage();
	const tLanding = makeTranslator("landing");
	const tCommon = makeTranslator("common");
	const authModule = useAuthModule();

	const appTitle = tLanding("app.title");
	const appHighlight = tLanding("app.highlight");
	const appDescription = [
		{
			Icon: AppWindowIcon,
			label: tLanding("app.description1"),
		},
		{
			Icon: ClipboardIcon,
			label: tLanding("app.description2"),
		},
		{
			Icon: SquareDashed,
			label: tLanding("app.description3"),
		},
		{
			Icon: CircleSlashIcon,
			label: tLanding("app.description4"),
		},
	];

	const youTitle = tLanding("app.title");
	const youHighlight = tLanding("app.highlight");
	const youDescription = [
		{
			Icon: PersonStandingIcon,
			label: tLanding("you.description1"),
		},
		{
			Icon: GroupIcon,
			label: tLanding("you.description2"),
		},
		{
			Icon: TargetIcon,
			label: tLanding("you.description3"),
		},
		{
			Icon: Clock9Icon,
			label: tLanding("you.description4"),
		},
	];

	const startTitle = tLanding("start.title");
	const startHighlight = tLanding("start.highlight");

	return (
		<div className="flex min-h-screen flex-col justify-between">
			<AppHeader />
			<div className="grid flex-1 grid-cols-3 gap-6 p-24">
				<div>
					<h1 className="text-6xl leading-none font-black">
						{appTitle} <span className="text-primary">{appHighlight}</span>
					</h1>

					<div className="flex flex-col gap-4 px-2 pt-6">
						{appDescription.map(({ Icon, label }, index) => (
							<div key={index} className="flex items-center gap-3">
								<div className="squircle primary xl">
									<Icon />
								</div>
								<h2 className="text-xl font-bold">{label}</h2>
							</div>
						))}
					</div>
				</div>

				<div>
					<h1 className="text-6xl leading-none font-black">
						{youTitle} <span className="text-primary">{youHighlight}</span>
					</h1>

					<div className="flex flex-col gap-4 px-2 pt-6">
						{youDescription.map(({ Icon, label }, index) => (
							<div key={index} className="flex items-center gap-3">
								<div className="squircle xl">
									<Icon />
								</div>
								<h2 className="text-xl font-bold">{label}</h2>
							</div>
						))}
					</div>
				</div>

				<div>
					<h1 className="text-6xl leading-none font-black">
						{startTitle} <span className="text-primary">{startHighlight}</span>
					</h1>
					{authModule.meQuery.data ? (
						<div className="flex items-center justify-center py-4">
							<Link to={clientRoutes.dashboard} className="button lg w-full">
								{tCommon("dashboard")}
							</Link>
						</div>
					) : (
						<LandingRegisterForm authModule={authModule} />
					)}
				</div>
			</div>

			<footer className="text-foreground/70 container mx-auto px-4 py-8 text-center">
				<p>
					{tLanding("footer")} <a href="https://ozanarslan.vercel.app">Ozan Arslan</a>.
				</p>
			</footer>
		</div>
	);
}
