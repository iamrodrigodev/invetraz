import { z } from "zod";

export const EstadoSetupRespuestaSchema = z.object({
	configurado: z.boolean(),
});

export type EstadoSetupRespuesta = z.infer<typeof EstadoSetupRespuestaSchema>;
