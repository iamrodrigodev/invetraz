import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "@/AppRouter.tsx";

import "@/styles/global.css";

const rootElement = document.querySelector("#root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<AppRouter />
		</StrictMode>,
	);
}
