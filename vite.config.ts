import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		assetsDir: "static",
	},
});
//
// function functionLoggingPlugin() {
// 	return {
// 		name: "function-logging",
// 		transform(code: string, id: string) {
// 			if (
// 				id.includes("node_modules") ||
// 				(!id.endsWith(".jsx") && !id.endsWith(".tsx") && !id.endsWith(".js") && !id.endsWith(".ts"))
// 			) {
// 				return;
// 			}
//
// 			// Simple regex-based approach (use with caution)
// 			if (process.env.NODE_ENV === "development") {
// 				// Pattern for arrow functions
// 				const arrowFunctionPattern = /(const|let|var)\s+(\w+)\s*=\s*(\([^)]*\)|\w+)\s*=>\s*{/g;
// 				let loggedCode = code.replace(
// 					arrowFunctionPattern,
// 					'$1 $2 = $3 => { console.log("🔍 $2 called", Date.now());',
// 				);
//
// 				// Pattern for regular function declarations
// 				const functionDeclarationPattern = /function\s+(\w+)\s*\(([^)]*)\)\s*{/g;
// 				loggedCode = loggedCode.replace(
// 					functionDeclarationPattern,
// 					'function $1($2) { console.log("🔍 $1 called", Date.now());',
// 				);
//
// 				// Pattern for function expressions
// 				const functionExpressionPattern =
// 					/(const|let|var)\s+(\w+)\s*=\s*function\s*(\([^)]*\))\s*{/g;
// 				loggedCode = loggedCode.replace(
// 					functionExpressionPattern,
// 					'$1 $2 = function $3 { console.log("🔍 $2 called", Date.now());',
// 				);
//
// 				return loggedCode;
// 			}
//
// 			return code;
// 		},
// 	};
// }
