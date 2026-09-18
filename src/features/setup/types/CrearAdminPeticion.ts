import { z } from "zod";

export const CrearAdminPeticionSchema = z
	.object({
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
			.min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
			.max(255, { message: "La contraseña no puede exceder 255 caracteres" })
			.regex(/[A-Z]/, { message: "Debe contener al menos una letra mayúscula" })
			.regex(/[0-9]/, { message: "Debe contener al menos un número" }),
		confirmPassword: z
			.string()
			.min(1, { message: "Debes confirmar tu contraseña" })
			.max(255, { message: "La contraseña no puede exceder 255 caracteres" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"], // El error se mostrará en este campo
	});

export type CrearAdminPeticion = z.infer<typeof CrearAdminPeticionSchema>;
