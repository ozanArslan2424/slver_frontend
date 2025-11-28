import { ErrorCard } from "../components/ui/error-card";
import { isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorBoundary() {
	const error = useRouteError();
	const isNotFound = isRouteErrorResponse(error) && error.status === 404;
	return <ErrorCard error={isNotFound ? "404 | Not Found" : (error as Error)} />;
}
