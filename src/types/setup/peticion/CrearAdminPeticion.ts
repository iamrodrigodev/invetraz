import { z } from "zod";

export const CrearAdminPeticionSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export type CrearAdminPeticion = z.infer<typeof CrearAdminPeticionSchema>;
