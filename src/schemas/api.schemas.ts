import { z } from "zod";

export const VerificarAutenticacionRespuestaSchema = z.object({
	autenticado: z.boolean(),
	email: z.string().nullable().optional(),
});

export type VerificarAutenticacionRespuesta = z.infer<
	typeof VerificarAutenticacionRespuestaSchema
>;

export const LoginRespuestaSchema = z.object({
	tokenAcceso: z.string().min(1),
});

export type LoginRespuesta = z.infer<typeof LoginRespuestaSchema>;

export const EstadoSetupRespuestaSchema = z.object({
	configurado: z.boolean(),
});

export type EstadoSetupRespuesta = z.infer<typeof EstadoSetupRespuestaSchema>;

export function crearApiRespuestaSchema<T extends z.ZodType>(datosSchema: T) {
	return z.object({
		estado: z.number().int().optional(),
		mensaje: z.string().optional(),
		idRastreo: z.string().nullable().optional(),
		ruta: z.string().nullable().optional(),
		fechaHora: z.string().nullable().optional(),
		datos: datosSchema,
		errores: z.unknown().optional(),
	});
}
