import { z } from "zod";

export const LoginPeticionSchema = z.object({
	email: z
		.string()
		.min(1, { message: "El correo es obligatorio" })
		.email({ message: "Correo inválido" })
		.endsWith("@ulasalle.edu.pe", {
			message: "Debe ser un correo institucional (@ulasalle.edu.pe)",
		}),
	password: z.string().min(1, { message: "La contraseña es obligatoria" }),
});

export type LoginPeticion = z.infer<typeof LoginPeticionSchema>;
