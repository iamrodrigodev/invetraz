import { z } from "zod";
import { VALIDATION_LIMITS } from "../../../constants/validations";

export const ActualizarCredencialesPeticionSchema = z.object({
	googleClientId: z
		.string()
		.trim()
		.min(1, "El Client ID es obligatorio")
		.max(
			VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_ID,
			`El Client ID no puede exceder los ${VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_ID} caracteres`,
		),
	googleClientSecret: z
		.string()
		.trim()
		.min(1, "El Client Secret es obligatorio")
		.max(
			VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_SECRET,
			`El Client Secret no puede exceder los ${VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_SECRET} caracteres`,
		),
	googleRefreshToken: z
		.string()
		.trim()
		.min(1, "El Refresh Token es obligatorio")
		.max(
			VALIDATION_LIMITS.MAX_GOOGLE_REFRESH_TOKEN,
			`El Refresh Token no puede exceder los ${VALIDATION_LIMITS.MAX_GOOGLE_REFRESH_TOKEN} caracteres`,
		),
	googleDriveFolderId: z.string().trim().nullable().optional(),
	googleDriveFolderName: z.string().trim().nullable().optional(),
});

export type ActualizarCredencialesPeticion = z.infer<
	typeof ActualizarCredencialesPeticionSchema
>;

export const ConfiguracionRespuestaSchema = z.object({
	googleClientId: z.string().optional().default(""),
	googleClientSecret: z.string().optional().default(""),
	googleRefreshToken: z.string().optional().default(""),
	googleDriveFolderId: z.string().nullable().optional().default(null),
	googleDriveFolderName: z.string().nullable().optional().default(null),
});

export type ConfiguracionRespuesta = z.infer<
	typeof ConfiguracionRespuestaSchema
>;

export const ResultadoVerificacionSchema = z.object({
	valido: z.boolean(),
	mensaje: z.string(),
});

export type ResultadoVerificacion = z.infer<typeof ResultadoVerificacionSchema>;
