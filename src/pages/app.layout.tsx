import { Outlet } from "react-router";

export function AppLayout() {
	return (
		<div className="bg-background min-h-screen">
			<Outlet />
		</div>
	);
}
