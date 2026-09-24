import { z } from "zod";

const fallbackApi = "http://localhost:8080/api/v1";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const apiBaseUrlNormalizada = apiBaseUrl && apiBaseUrl !== "undefined" ? apiBaseUrl : fallbackApi;

const EntornoSchema = z.object({
	VITE_API_BASE_URL: z.string().default(fallbackApi),
	DEV: z.boolean().default(false),
	PROD: z.boolean().default(true),
});

export const entorno = EntornoSchema.parse({
	VITE_API_BASE_URL: apiBaseUrlNormalizada,
	DEV: import.meta.env.DEV,
	PROD: import.meta.env.PROD,
});
