import type { z } from "zod";
import { limpiarSesion } from "./sesion";

type ManejadorExpiracion = () => void;
let manejadorSesionExpirada: ManejadorExpiracion | null = null;

export function alExpirarSesion(callback: ManejadorExpiracion): void {
	manejadorSesionExpirada = callback;
}

export async function fetchSeguro(
	url: string,
	options: RequestInit = {},
): Promise<Response> {
	try {
		options.credentials = "include";
		const res = await fetch(url, options);

		if (
			(res.status === 401 || res.status === 403) &&
			!url.includes("/auth/login") &&
			!url.includes("/auth/logout") &&
			!url.includes("/auth/me")
		) {
			limpiarSesion("sesion_expirada");

			if (manejadorSesionExpirada) {
				manejadorSesionExpirada();
			}

			if (
				typeof window !== "undefined" &&
				window.location.pathname !== "/login"
			) {
				window.location.replace("/login");
			}
		}

		return res;
	} catch (error) {
		if (
			error instanceof Error &&
			error.message.includes("El servidor no responde")
		) {
			throw error;
		}
		throw new Error(
			"El servidor no responde. Verifica que esté encendido o revisa tu conexión a internet.",
		);
	}
}

export async function extraerMensajeError(
	res: Response,
	mensajePorDefecto: string,
): Promise<string> {
	try {
		const contentType = res.headers.get("content-type");
		if (!contentType?.includes("application/json")) {
			return mensajePorDefecto;
		}
		const errorData = (await res.json()) as Record<string, unknown>;
		if (typeof errorData.mensaje === "string") return errorData.mensaje;
		if (typeof errorData.message === "string") return errorData.message;
		if (typeof errorData.error === "string") return errorData.error;
		return mensajePorDefecto;
	} catch (_e) {
		return mensajePorDefecto;
	}
}

export async function parsearJsonSeguro<T>(res: Response): Promise<T> {
	const contentType = res.headers.get("content-type");
	if (!contentType?.includes("application/json")) {
		throw new Error(
			"Error de comunicación con el servidor. Inténtalo de nuevo más tarde.",
		);
	}
	return (await res.json()) as T;
}

export async function parsearConEsquema<T>(
	res: Response,
	schema: z.ZodType<T>,
): Promise<T> {
	const contentType = res.headers.get("content-type");
	if (!contentType?.includes("application/json")) {
		throw new Error(
			"Error de comunicación con el servidor. Inténtalo de nuevo más tarde.",
		);
	}
	const json: unknown = await res.json();
	return schema.parse(json);
}
