import { Loader2Icon } from "lucide-react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { useTheme } from "next-themes";
import { PersonAvatar } from "@/components/ui/person-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/modules/language/use-language";
import { useAuthModule } from "@/modules/auth/use-auth-module";
import { Link } from "react-router";
import { clientRoutes } from "@/client.routes";

export function AppHeader() {
	const { t, i18n } = useLanguage("common");
	const isMounted = useIsMounted();
	const { setTheme, resolvedTheme } = useTheme();
	const authModule = useAuthModule();

	function handleLogout() {
		authModule.logoutMutation.mutate();
	}

	function handleTheme() {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}

	function handleLanguage() {
		i18n.changeLanguage(i18n.language === "en" ? "tr" : "en");
	}

	const buttonClassName = "outlined rounded-none border-x-transparent shadow-none text-sm";
	const iconClassName = "size-4";

	return (
		<header className="flex h-10 shrink-0 items-center justify-between border-y">
			<div className="flex items-center px-4 lg:px-12">
				<h1 className="text-lg font-bold">{t("app.name")}</h1>
			</div>
			<div className="flex items-center px-4 lg:px-12">
				{isMounted ? (
					<button type="button" className={buttonClassName} onClick={handleTheme}>
						{resolvedTheme === "dark" ? (
							<SunIcon className={iconClassName} />
						) : (
							<MoonIcon className={iconClassName} />
						)}
					</button>
				) : (
					<button type="button" className={buttonClassName}>
						<Loader2Icon className={iconClassName} />
					</button>
				)}

				{authModule.meQuery.isPending ? (
					<button type="button" className={buttonClassName}>
						<Loader2Icon className={iconClassName} />
					</button>
				) : authModule.meQuery.error ? (
					<Link to={clientRoutes.login}>
						<button type="button" className={buttonClassName}>
							{t("login")}
						</button>
					</Link>
				) : (
					<DropdownMenu
						trigger={
							<button type="button" className={buttonClassName}>
								<PersonAvatar person={authModule.meQuery.data} className="size-5" />
							</button>
						}
					>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={handleLanguage}>{t("language")}</DropdownMenuItem>
							<DropdownMenuItem onClick={handleLogout}>{t("logout")}</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</header>
	);
}
