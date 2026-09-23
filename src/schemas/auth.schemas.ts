import { z } from "zod";
import { VALIDATION_LIMITS } from "@/constants/validations";

export const emailInstitucionalSchema = z
	.string()
	.trim()
	.min(1, { message: "El correo es obligatorio" })
	.max(VALIDATION_LIMITS.MAX_EMAIL, {
		message: `El correo no puede exceder los ${VALIDATION_LIMITS.MAX_EMAIL} caracteres`,
	})
	.pipe(z.email({ error: "Correo inválido" }))
	.refine((email) => email.endsWith("@ulasalle.edu.pe"), {
		message: "Debe ser un correo institucional (@ulasalle.edu.pe)",
	});

export const passwordSeguroSchema = z
	.string()
	.min(1, { message: "La contraseña es obligatoria" })
	.min(VALIDATION_LIMITS.MIN_PASSWORD, {
		message: `La contraseña debe tener al menos ${VALIDATION_LIMITS.MIN_PASSWORD} caracteres`,
	})
	.max(VALIDATION_LIMITS.MAX_PASSWORD, {
		message: `La contraseña no puede exceder los ${VALIDATION_LIMITS.MAX_PASSWORD} caracteres`,
	})
	.regex(/[A-Z]/, { message: "Debe contener al menos una letra mayúscula" })
	.regex(/[0-9]/, { message: "Debe contener al menos un número" })
	.regex(/^[^\n\r]+$/, { message: "No se permiten saltos de línea" });

export const passwordActualSchema = z
	.string()
	.min(1, { message: "Ingresa tu contraseña actual" })
	.max(VALIDATION_LIMITS.MAX_PASSWORD, {
		message: `La contraseña no puede exceder los ${VALIDATION_LIMITS.MAX_PASSWORD} caracteres`,
	});

export const LoginSchema = z.object({
	email: emailInstitucionalSchema,
	password: z
		.string()
		.min(1, { message: "La contraseña es obligatoria" })
		.max(VALIDATION_LIMITS.MAX_PASSWORD, {
			message: `La contraseña no puede exceder los ${VALIDATION_LIMITS.MAX_PASSWORD} caracteres`,
		})
		.regex(/^[^\n\r]+$/, { message: "No se permiten saltos de línea" }),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const CrearAdminSchema = z
	.object({
		email: emailInstitucionalSchema,
		password: passwordSeguroSchema,
		confirmPassword: z
			.string()
			.min(1, { message: "Debes confirmar tu contraseña" })
			.max(VALIDATION_LIMITS.MAX_PASSWORD, {
				message: `La contraseña no puede exceder los ${VALIDATION_LIMITS.MAX_PASSWORD} caracteres`,
			}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});

export type CrearAdminFormData = z.infer<typeof CrearAdminSchema>;

export const CambiarClavePaso1Schema = z.object({
	claveActual: passwordActualSchema,
});

export type CambiarClavePaso1FormData = z.infer<typeof CambiarClavePaso1Schema>;

export const CambiarClavePaso2Schema = z
	.object({
		nuevaClave: passwordSeguroSchema,
		confirmarClave: z
			.string()
			.min(1, { message: "Confirma tu nueva contraseña" })
			.max(VALIDATION_LIMITS.MAX_PASSWORD, {
				message: `La contraseña no puede exceder los ${VALIDATION_LIMITS.MAX_PASSWORD} caracteres`,
			}),
	})
	.refine((data) => data.nuevaClave === data.confirmarClave, {
		message: "Las contraseñas no coinciden",
		path: ["confirmarClave"],
	});

export type CambiarClavePaso2FormData = z.infer<typeof CambiarClavePaso2Schema>;
