import { entorno } from "@/config/entorno.ts";
import type { LoginPeticion } from "@/features/auth/types/LoginPeticion.ts";
import {
	type LoginRespuesta,
	LoginRespuestaSchema,
	VerificarAutenticacionRespuestaSchema,
} from "@/schemas/api.schemas.ts";
import { ejecutarAccion, ejecutarPeticion, leerDatos } from "@/utils/api.ts";
import { fetchSeguro } from "@/utils/fetch.ts";

export async function login(peticion: LoginPeticion): Promise<LoginRespuesta> {
	return ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/auth/login`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(peticion),
		},
		LoginRespuestaSchema,
		"Credenciales inválidas",
	);
}

export interface ResultadoAutenticacion {
	autenticado: boolean;
	email?: string | null;
}

export async function verificarAutenticacion(): Promise<ResultadoAutenticacion> {
	const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/auth/me`, {
		method: "GET",
	});
	if (res.status === 401) {
		return { autenticado: false };
	}

	const datos = await leerDatos(
		res,
		VerificarAutenticacionRespuestaSchema,
		"No se pudo verificar la sesión",
	);
	return {
		autenticado: datos.autenticado,
		email: datos.email ?? null,
	};
}

export async function logout(): Promise<void> {
	return ejecutarAccion(
		`${entorno.VITE_API_BASE_URL}/auth/logout`,
		{ method: "POST" },
		"Error al cerrar sesión",
	);
}

export async function verificarPasswordActual(password: string): Promise<void> {
	return ejecutarAccion(
		`${entorno.VITE_API_BASE_URL}/auth/verificar-password`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password }),
		},
		"La contraseña actual es incorrecta",
	);
}

export async function cambiarPassword(
	passwordActual: string,
	passwordNueva: string,
): Promise<void> {
	return ejecutarAccion(
		`${entorno.VITE_API_BASE_URL}/auth/cambiar-password`,
		{
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ passwordActual, passwordNueva }),
		},
		"Hubo un error al actualizar la contraseña",
	);
}
