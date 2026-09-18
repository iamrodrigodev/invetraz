import { z } from "zod";

export const LoginPeticionSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

export type LoginPeticion = z.infer<typeof LoginPeticionSchema>;
