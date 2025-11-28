import { useAppContext } from "@/app";
import { clientRoutes } from "@/client.routes";
import { useLanguage } from "@/modules/language/use-language";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export function AuthLayout() {
	const { makeTranslator } = useLanguage();
	const tCommon = makeTranslator("common");
	const tAuth = makeTranslator("auth");
	const navigate = useNavigate();
	const ctx = useAppContext();

	useEffect(() => {
		async function init() {
			try {
				const res = await ctx.query.fetchQuery(ctx.auth.queryMe());
				ctx.store.set("groupId", res.memberships.length !== 0 ? res.memberships[0].groupId : null);
				ctx.auth.setActive(res);
				await navigate(clientRoutes.dashboard);
			} catch {}
		}

		init();
	}, [ctx.query, ctx.auth, ctx.store, navigate]);

	const appName = tCommon("app.name");
	const tosLabel = tAuth("tos.label");

	return (
		<div className="flex min-h-screen flex-col items-center p-6 md:p-10">
			<div className="w-full max-w-md">
				<h1 className="text-primary pt-12 pb-6 text-center text-6xl leading-none font-black">
					{appName}
				</h1>

				<div className="flex flex-col gap-6">
					<div className="card lg overflow-hidden p-0">
						<Outlet />
					</div>
					<p className="text-foreground/70 hover:text-foreground cursor-pointer text-center text-sm whitespace-nowrap transition-all">
						{tosLabel}
					</p>
				</div>
			</div>
		</div>
	);
}
