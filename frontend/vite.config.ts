import process from "node:process";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	preview: {
		port: Number.parseInt(process.env.PORT || "5173", 10),
	},
	build: {
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
						return "vendor-react";
					}
					if (id.includes("node_modules/lucide-react")) {
						return "vendor-icons";
					}
				},
			},
		},
	},
	server: {
		port: Number.parseInt(process.env.PORT || "5173", 10),
	},
});
