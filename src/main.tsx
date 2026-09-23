import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "@/AppRouter";

import "@/styles/global.css";

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<AppRouter />
		</StrictMode>,
	);
}
