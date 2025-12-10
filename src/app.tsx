import { RouterProvider } from "react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/react";
import { ModeContextProvider } from "@/modules/context/mode.context";
import { router } from "@/router";
import { AppContextProvider } from "@/modules/context/app.context";
import { ModalContextProvider } from "@/modules/context/modal.context";
import { RangeContextProvider } from "@/modules/context/range.context";

export function App() {
	return (
		<NuqsAdapter>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
				<AppContextProvider>
					<RangeContextProvider>
						<ModalContextProvider>
							<ModeContextProvider>
								<Toaster richColors position="top-right" />
								<RouterProvider router={router} />
							</ModeContextProvider>
						</ModalContextProvider>
					</RangeContextProvider>
				</AppContextProvider>
			</ThemeProvider>
		</NuqsAdapter>
	);
}
