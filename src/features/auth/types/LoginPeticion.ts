import { z } from "zod";

export const LoginPeticionSchema = z.object({
	email: z
		.string()
		.min(1, { message: "El correo es obligatorio" })
		.email({ message: "Correo inválido" })
		.max(150, { message: "El correo no puede exceder 150 caracteres" })
		.endsWith("@ulasalle.edu.pe", {
			message: "Debe ser un correo institucional (@ulasalle.edu.pe)",
		}),
	password: z
		.string()
		.min(1, { message: "La contraseña es obligatoria" })
		.max(255, { message: "La contraseña no puede exceder 255 caracteres" }),
});

export type LoginPeticion = z.infer<typeof LoginPeticionSchema>;
