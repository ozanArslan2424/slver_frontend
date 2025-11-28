import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/react";
import { createContext, use } from "react";
import { ModeProvider } from "@/modules/keyboard/mode.context";
import { getContext } from "@/context";
import { router } from "@/router";

const context = getContext();

const AppContext = createContext<typeof context>(context);

export function useAppContext() {
	const value = use(AppContext);
	if (!value) throw new Error("AppContext requires a provider.");
	return value;
}

export function App() {
	return (
		<NuqsAdapter>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
				<QueryClientProvider client={context.query}>
					<AppContext value={context}>
						<ModeProvider>
							<Toaster richColors position="top-right" />
							<RouterProvider router={router} />
						</ModeProvider>
					</AppContext>
				</QueryClientProvider>
			</ThemeProvider>
		</NuqsAdapter>
	);
}
