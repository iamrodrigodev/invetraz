import type { z } from "zod";
import { crearApiRespuestaSchema } from "../schemas/api.schemas";
import { extraerMensajeError, parsearConEsquema } from "./fetch";

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
