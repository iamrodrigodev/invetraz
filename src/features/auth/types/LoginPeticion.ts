import { z } from "zod";
import { VALIDATION_LIMITS } from "../../../constants/validations";

export const LoginPeticionSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, { message: "El correo es obligatorio" })
		.email({ message: "Correo inválido" })
		.max(VALIDATION_LIMITS.MAX_EMAIL, {
			message:
				"El correo no puede exceder los " +
				VALIDATION_LIMITS.MAX_EMAIL +
				" caracteres",
		})
		.endsWith("@ulasalle.edu.pe", {
			message: "Debe ser un correo institucional (@ulasalle.edu.pe)",
		}),
	password: z
		.string()
		.min(1, { message: "La contraseña es obligatoria" })
		.max(VALIDATION_LIMITS.MAX_PASSWORD, {
			message:
				"La contraseña no puede exceder los " +
				VALIDATION_LIMITS.MAX_PASSWORD +
				" caracteres",
		})
		.regex(/^[^\n\r]+$/, { message: "No se permiten saltos de línea" }),
});

export type LoginPeticion = z.infer<typeof LoginPeticionSchema>;
