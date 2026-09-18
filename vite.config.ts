import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	preview: {
		port: parseInt(process.env.PORT || "5173"),
	},
	build: {
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (
						id.includes("node_modules/react") ||
						id.includes("node_modules/react-dom")
					) {
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
		port: parseInt(process.env.PORT || "5173"),
		proxy: {
			"/api": {
				target: "http://localhost:8080",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
