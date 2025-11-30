import { clientRoutes } from "@/client.routes";
import { LandingRegisterForm } from "@/components/landing-register-form";
import { AppHeader } from "@/components/layout/app-header";
import { useAuthModule } from "@/modules/auth/use-auth-module";
import { useLanguage } from "@/modules/language/use-language";
import {
	AppWindowIcon,
	CircleSlashIcon,
	ClipboardIcon,
	Clock9Icon,
	GroupIcon,
	PersonStandingIcon,
	SquareDashed,
	TargetIcon,
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

	const youTitle = tLanding("you.title");
	const youHighlight = tLanding("you.highlight");
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
			<div className="flex flex-1 flex-col gap-6 px-4 py-8 sm:grid sm:grid-cols-2 sm:p-24 lg:grid-cols-3">
				<div>
					<div className="flex items-center justify-between">
						<h1 className="text-3xl leading-none font-black sm:text-6xl">
							{appTitle} <span className="text-primary">{appHighlight}</span>
						</h1>
						<div className="flex items-center gap-1">
							{appDescription.map(({ Icon }, index) => (
								<div key={index} className="squircle primary inline-flex sm:hidden">
									<Icon />
								</div>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-4 px-2 pt-4 sm:pt-6">
						{appDescription.map(({ Icon, label }, index) => (
							<div key={index} className="flex items-center gap-3">
								<div className="squircle primary xl hidden sm:inline-flex">
									<Icon />
								</div>
								<h2 className="text-lg font-bold sm:text-xl">{label}</h2>
							</div>
						))}
					</div>
				</div>

				<div>
					<div className="flex items-center justify-between">
						<h1 className="text-3xl leading-none font-black sm:text-6xl">
							{youTitle} <span className="text-primary">{youHighlight}</span>
						</h1>
						<div className="flex items-center gap-1">
							{youDescription.map(({ Icon }, index) => (
								<div key={index} className="squircle primary inline-flex sm:hidden">
									<Icon />
								</div>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-4 px-2 pt-4 sm:pt-6">
						{youDescription.map(({ Icon, label }, index) => (
							<div key={index} className="flex items-center gap-3">
								<div className="squircle xl hidden sm:inline-flex">
									<Icon />
								</div>
								<h2 className="text-lg font-bold sm:text-xl">{label}</h2>
							</div>
						))}
					</div>
				</div>

				<div>
					<h1 className="text-3xl leading-none font-black sm:text-6xl">
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
