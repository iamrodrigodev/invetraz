import { z } from "zod";
import { VALIDATION_LIMITS } from "../../../constants/validations";

export const CrearAdminPeticionSchema = z
	.object({
		email: z
			.string()
			.min(1, { message: "El correo es obligatorio" })
			.email({ message: "Correo inválido" })
			.max(VALIDATION_LIMITS.MAX_EMAIL, { message: `El correo no puede exceder los ${VALIDATION_LIMITS.MAX_EMAIL} caracteres` })
			.endsWith("@ulasalle.edu.pe", {
				message: "Debe ser un correo institucional (@ulasalle.edu.pe)",
			}),
		password: z
			.string()
			.min(1, { message: "La contraseña es obligatoria" })
			.min(VALIDATION_LIMITS.MIN_PASSWORD, { message: `La contraseña debe tener al menos ${VALIDATION_LIMITS.MIN_PASSWORD} caracteres` })
			.max(VALIDATION_LIMITS.MAX_PASSWORD, { message: `La contraseña no puede exceder los ${VALIDATION_LIMITS.MAX_PASSWORD} caracteres` })
			.regex(/[A-Z]/, { message: "Debe contener al menos una letra mayúscula" })
			.regex(/[0-9]/, { message: "Debe contener al menos un número" }),
		confirmPassword: z
			.string()
			.min(1, { message: "Debes confirmar tu contraseña" })
			.max(VALIDATION_LIMITS.MAX_PASSWORD, { message: `La contraseña no puede exceder los ${VALIDATION_LIMITS.MAX_PASSWORD} caracteres` }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});

export type CrearAdminPeticion = z.infer<typeof CrearAdminPeticionSchema>;