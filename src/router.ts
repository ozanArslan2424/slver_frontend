import { AppLayout } from "./pages/app.layout";
import { ProtectedLayout } from "./pages/protected.layout";
import { clientRoutes } from "./client.routes";
import { AuthLayout } from "./pages/auth.layout";
import { DashboardPage } from "./pages/dashboard.page";
import { ErrorBoundary } from "./pages/error.boundary";
import { LandingPage } from "./pages/landing.page";
import { LoginPage } from "./pages/login.page";
import { RegisterPage } from "./pages/register.page";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
	{
		Component: AppLayout,
		ErrorBoundary,
		children: [
			{ path: clientRoutes.landing, Component: LandingPage },
			{
				Component: ProtectedLayout,
				children: [{ path: clientRoutes.dashboard, Component: DashboardPage }],
			},
			{
				Component: AuthLayout,
				children: [
					{ path: clientRoutes.login, Component: LoginPage },
					{ path: clientRoutes.register, Component: RegisterPage },
				],
			},
			// Fallback route for 404 pages
			{ path: "*", Component: ErrorBoundary },
		],
	},
]);
