import { App } from "./app.tsx";
import "./modules/language/language.config.ts";
import ReactDOM from "react-dom/client";
import "./styles/index.css";

function main() {
	const el = document.getElementById("root");
	if (!el) throw new Error("DOM element not found.");
	const root = ReactDOM.createRoot(el);
	root.render(<App />);
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", main);
} else {
	main();
}
