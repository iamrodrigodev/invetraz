import { z } from "zod";
import { VALIDATION_LIMITS } from "../../../constants/validations";

export const ActualizarCredencialesPeticionSchema = z.object({
	googleClientId: z
		.string()
		.min(1, "El Client ID es obligatorio")
		.max(
			VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_ID,
			`El Client ID no puede exceder los ${VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_ID} caracteres`,
		),
	googleClientSecret: z
		.string()
		.min(1, "El Client Secret es obligatorio")
		.max(
			VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_SECRET,
			`El Client Secret no puede exceder los ${VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_SECRET} caracteres`,
		),
	googleRefreshToken: z
		.string()
		.min(1, "El Refresh Token es obligatorio")
		.max(
			VALIDATION_LIMITS.MAX_GOOGLE_REFRESH_TOKEN,
			`El Refresh Token no puede exceder los ${VALIDATION_LIMITS.MAX_GOOGLE_REFRESH_TOKEN} caracteres`,
		),
});

export type ActualizarCredencialesPeticion = z.infer<
	typeof ActualizarCredencialesPeticionSchema
>;
