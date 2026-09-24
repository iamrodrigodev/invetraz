import { z } from "zod";

const fallbackApiLocal = "http://localhost:8080/api/v1";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const apiBaseUrlNormalizada =
	apiBaseUrl && apiBaseUrl !== "undefined"
		? apiBaseUrl
		: import.meta.env.DEV
			? fallbackApiLocal
			: "";

const EntornoSchema = z.object({
	VITE_API_BASE_URL: z.string(),
	DEV: z.boolean().default(false),
	PROD: z.boolean().default(true),
});

export const entorno = EntornoSchema.parse({
	VITE_API_BASE_URL: apiBaseUrlNormalizada,
	DEV: import.meta.env.DEV,
	PROD: import.meta.env.PROD,
});

export function asegurarApiConfigurada(): void {
	if (!entorno.VITE_API_BASE_URL) {
		throw new Error("El servidor no responde. Inténtalo nuevamente en unos minutos.");
	}
}

export function obtenerApiBaseUrl(): string {
	asegurarApiConfigurada();
	return entorno.VITE_API_BASE_URL;
}
