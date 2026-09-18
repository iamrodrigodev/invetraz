import { z } from "zod";

const fallbackApi =
	typeof window !== "undefined" &&
	window.location.hostname.includes("iamrodrigo.dev")
		? "https://apiinvestigacion.iamrodrigo.dev/api/v1"
		: import.meta.env.PROD
			? "https://apiinvestigacion.iamrodrigo.dev/api/v1"
			: "http://localhost:8080/api/v1";

const EntornoSchema = z.object({
	VITE_API_BASE_URL: z.string().default(fallbackApi),
	DEV: z.boolean().default(false),
	PROD: z.boolean().default(true),
});

export const entorno = EntornoSchema.parse({
	VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || fallbackApi,
	DEV: import.meta.env.DEV,
	PROD: import.meta.env.PROD,
});
