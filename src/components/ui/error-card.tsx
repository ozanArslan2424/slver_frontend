import { clientRoutes } from "@/client.routes";
import { useLanguage } from "@/modules/language/use-language";
import { Link } from "react-router";

export function ErrorCard({ error }: { error: Error | null | string }) {
	const { t } = useLanguage("common");
	const title = t("error");
	const description = typeof error === "string" ? error : error?.message || t("retry");

	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="card">
				<h1>{title}</h1>
				<p>{description}</p>
				<Link to={clientRoutes.dashboard}>
					<button>{t("back")}</button>
				</Link>
			</div>
		</div>
	);
}
