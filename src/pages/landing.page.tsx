import { FormField } from "@/components/form/form-field";
import { UserIcon, AtSignIcon, AsteriskIcon, LoaderIcon } from "lucide-react";
import { clientRoutes } from "@/client.routes";
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
import { LandingMotionContainer } from "@/components/landing-motion-container";
import { LandingMotionItem } from "@/components/landing-motion-item";
import { PersonCard } from "@/components/person-card";

export function LandingPage() {
	const authModule = useAuthModule();
	const { makeTranslator } = useLanguage();
	const landingT = makeTranslator("landing");
	const authT = makeTranslator("auth");

	const appItems = [
		{
			Icon: AppWindowIcon,
			label: landingT("app.description1"),
		},
		{
			Icon: ClipboardIcon,
			label: landingT("app.description2"),
		},
		{
			Icon: SquareDashed,
			label: landingT("app.description3"),
		},
		{
			Icon: CircleSlashIcon,
			label: landingT("app.description4"),
		},
	];

	const youItems = [
		{
			Icon: PersonStandingIcon,
			label: landingT("you.description1"),
		},
		{
			Icon: GroupIcon,
			label: landingT("you.description2"),
		},
		{
			Icon: TargetIcon,
			label: landingT("you.description3"),
		},
		{
			Icon: Clock9Icon,
			label: landingT("you.description4"),
		},
	];

	return (
		<div className="flex min-h-screen flex-col justify-between">
			<AppHeader />

			<LandingMotionContainer className="flex flex-1 flex-col gap-6 px-4 py-8 sm:grid sm:grid-cols-2 sm:p-16 lg:grid-cols-3">
				<LandingMotionItem>
					<div className="flex items-center justify-between">
						<h1 className="text-3xl leading-none font-black sm:text-6xl">
							{landingT("app.title")}{" "}
							<span className="text-primary">{landingT("app.highlight")}</span>
						</h1>
						<div className="flex items-center gap-1">
							{appItems.map(({ Icon }, index) => (
								<div key={index} className="squircle primary inline-flex sm:hidden">
									<Icon />
								</div>
							))}
						</div>
					</div>
					<LandingMotionContainer className="flex flex-col gap-4 px-2 pt-4 sm:pt-6">
						{appItems.map(({ Icon, label }, index) => (
							<LandingMotionItem key={index} className="flex items-center gap-3">
								<div className="squircle primary xl hidden sm:inline-flex">
									<Icon />
								</div>
								<h2 className="text-lg font-bold sm:text-xl">{label}</h2>
							</LandingMotionItem>
						))}
					</LandingMotionContainer>
				</LandingMotionItem>

				<LandingMotionItem>
					<div className="flex items-center justify-between">
						<h1 className="text-3xl leading-none font-black sm:text-6xl">
							{landingT("you.title")}{" "}
							<span className="text-primary">{landingT("you.highlight")}</span>
						</h1>
						<div className="flex items-center gap-1">
							{youItems.map(({ Icon }, index) => (
								<div key={index} className="squircle primary inline-flex sm:hidden">
									<Icon />
								</div>
							))}
						</div>
					</div>
					<LandingMotionContainer className="flex flex-col gap-4 px-2 pt-4 sm:pt-6">
						{youItems.map(({ Icon, label }, index) => (
							<LandingMotionItem key={index} className="flex items-center gap-3">
								<div className="squircle xl hidden sm:inline-flex">
									<Icon />
								</div>
								<h2 className="text-lg font-bold sm:text-xl">{label}</h2>
							</LandingMotionItem>
						))}
					</LandingMotionContainer>
				</LandingMotionItem>

				{authModule.meQuery.data ? (
					<LandingMotionItem>
						<h1 className="text-3xl leading-none font-black sm:text-6xl">
							{landingT("welcome.title")}{" "}
							<span className="text-primary">{landingT("welcome.highlight")}</span>
						</h1>
						<div className="grid grid-cols-3 gap-3 pt-6">
							<div className="col-span-1">
								<PersonCard person={authModule.meQuery.data} />
							</div>
							<div className="col-span-2">
								<div className="flex flex-col gap-3">
									<Link to={clientRoutes.dashboard} className="button lg w-full">
										{landingT("dashboard")}
									</Link>
								</div>
							</div>
						</div>
					</LandingMotionItem>
				) : (
					<LandingMotionItem>
						<h1 className="text-3xl leading-none font-black sm:text-6xl">
							{landingT("start.title")}{" "}
							<span className="text-primary">{landingT("start.highlight")}</span>
						</h1>

						<form {...authModule.registerForm.methods}>
							<LandingMotionContainer className="flex flex-col gap-3 px-2 pt-6 sm:gap-4">
								<LandingMotionItem className="flex items-center gap-3">
									<div className="squircle xl primary">
										<UserIcon />
									</div>
									<FormField form={authModule.registerForm} name="name" id="name">
										<input
											className="ghost"
											autoComplete="name"
											type="text"
											placeholder={authT("register.name.label")}
											required
										/>
									</FormField>
								</LandingMotionItem>

								<LandingMotionItem className="flex items-center gap-3">
									<div className="squircle xl primary">
										<AtSignIcon className="size-6" />
									</div>
									<FormField form={authModule.registerForm} name="email" id="email">
										<input
											className="ghost"
											autoComplete="email"
											type="email"
											placeholder={authT("register.email.label")}
											required
										/>
									</FormField>
								</LandingMotionItem>

								<LandingMotionItem className="flex items-center gap-3">
									<div className="squircle xl primary">
										<AsteriskIcon />
									</div>
									<FormField form={authModule.registerForm} name="password" id="password">
										<input
											className="ghost"
											autoComplete="new-password"
											type="password"
											placeholder={authT("register.password.label")}
											required
										/>
									</FormField>
								</LandingMotionItem>

								<LandingMotionItem>
									<button type="submit" className="lg w-full">
										{authModule.registerForm.isPending ? (
											<LoaderIcon className="animate-spin" />
										) : (
											authT("register.submit")
										)}
									</button>
								</LandingMotionItem>
							</LandingMotionContainer>
						</form>
					</LandingMotionItem>
				)}
			</LandingMotionContainer>

			<footer className="text-foreground/70 container mx-auto px-4 py-8 text-center">
				<p className="text-sm sm:text-base">
					{landingT("footer")} <a href="https://ozanarslan.vercel.app">Ozan Arslan</a>.
				</p>
			</footer>
		</div>
	);
}
