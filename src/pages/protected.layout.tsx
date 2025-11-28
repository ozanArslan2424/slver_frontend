import { AppHeader } from "@/components/layout/app-header";
import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { PendingCard } from "@/components/ui/pending-card";
import { AppFooter } from "@/components/layout/app-footer";
import { clientRoutes } from "@/client.routes";
import { useAppContext } from "@/app";

export function ProtectedLayout() {
	const navigate = useNavigate();
	const ctx = useAppContext();
	const [isPending, setIsPending] = useState(true);

	useEffect(() => {
		async function init() {
			try {
				const res = await ctx.query.fetchQuery(ctx.auth.queryMe());
				ctx.store.set("groupId", res.memberships.length !== 0 ? res.memberships[0].groupId : null);
				ctx.auth.setActive(res);
			} catch {
				await navigate(clientRoutes.login);
			} finally {
				setIsPending(false);
			}
		}

		init();
	}, [ctx.query, ctx.auth, ctx.store, navigate]);

	if (isPending) {
		return <PendingCard />;
	}

	return (
		<div className="relative">
			<AppHeader />
			<div className="flex flex-1 flex-col">
				<div className="@container/main flex flex-1 flex-col gap-2">
					<Outlet />
				</div>
			</div>
			<AppFooter />
		</div>
	);
}
