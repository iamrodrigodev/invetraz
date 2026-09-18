import { z } from "zod";

export const ActualizarCredencialesPeticionSchema = z.object({
	googleClientId: z.string().min(1),
	googleClientSecret: z.string().min(1),
	googleRefreshToken: z.string().min(1),
});

export type ActualizarCredencialesPeticion = z.infer<
	typeof ActualizarCredencialesPeticionSchema
>;
