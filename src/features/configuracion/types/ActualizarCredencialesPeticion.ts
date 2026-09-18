import { z } from "zod";

export const ActualizarCredencialesPeticionSchema = z.object({
	googleClientId: z
		.string()
		.min(1, "El Client ID es obligatorio")
		.max(500, "El Client ID no puede exceder 500 caracteres"),
	googleClientSecret: z
		.string()
		.min(1, "El Client Secret es obligatorio")
		.max(1000, "El Client Secret no puede exceder 1000 caracteres"),
	googleRefreshToken: z
		.string()
		.min(1, "El Refresh Token es obligatorio")
		.max(1000, "El Refresh Token no puede exceder 1000 caracteres"),
});

export type ActualizarCredencialesPeticion = z.infer<
	typeof ActualizarCredencialesPeticionSchema
>;
