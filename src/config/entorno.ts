import { z } from "zod";

const apiBaseUrlLocal = "http://localhost:8080/api/v1";
const apiBaseUrlProduccion = "https://api-investigacion.iamrodrigo.dev/api/v1";
const apiBaseUrlNormalizada = import.meta.env.PROD ? apiBaseUrlProduccion : apiBaseUrlLocal;

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
