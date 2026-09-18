import { z } from "zod";

export const LoginRespuestaSchema = z.object({
	tokenAcceso: z.string().min(1),
});

export type LoginRespuesta = z.infer<typeof LoginRespuestaSchema>;
