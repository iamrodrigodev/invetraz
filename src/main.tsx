import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./AppRouter";

import "./styles/index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<AppRouter />
		</StrictMode>,
	);
}
