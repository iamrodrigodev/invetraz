import type { z } from "zod";
import { crearApiRespuestaSchema } from "../schemas/api.schemas";
import { extraerMensajeError, fetchSeguro, parsearConEsquema } from "./fetch";

export async function leerDatos<T extends z.ZodType>(
	respuesta: Response,
	esquema: T,
	mensajeError: string,
): Promise<z.infer<T>> {
	if (!respuesta.ok) {
		throw new Error(await extraerMensajeError(respuesta, mensajeError));
	}
	const envoltura = await parsearConEsquema(
		respuesta,
		crearApiRespuestaSchema(esquema),
	);
	return (envoltura as unknown as { datos: z.infer<T> }).datos;
}

export async function ejecutarPeticion<T extends z.ZodType>(
	url: string,
	opciones: RequestInit = {},
	esquema: T,
	mensajeError: string,
): Promise<z.infer<T>> {
	const res = await fetchSeguro(url, opciones);
	return leerDatos(res, esquema, mensajeError);
}

export async function ejecutarAccion(
	url: string,
	opciones: RequestInit = {},
	mensajeError: string,
): Promise<void> {
	const res = await fetchSeguro(url, opciones);
	if (!res.ok) {
		throw new Error(await extraerMensajeError(res, mensajeError));
	}
}
