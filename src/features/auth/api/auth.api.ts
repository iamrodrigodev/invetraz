import { entorno } from "../../../config/entorno";
import {
	type LoginRespuesta,
	LoginRespuestaSchema,
	VerificarAutenticacionRespuestaSchema,
} from "../../../schemas/api.schemas";
import { leerDatos } from "../../../utils/api";
import { extraerMensajeError, fetchSeguro } from "../../../utils/fetch";
import type { LoginPeticion } from "../types/LoginPeticion";

export async function login(peticion: LoginPeticion): Promise<LoginRespuesta> {
	const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(peticion),
	});

	return leerDatos(res, LoginRespuestaSchema, "Credenciales inválidas");
}

export interface ResultadoAutenticacion {
	autenticado: boolean;
	email?: string | null;
}

export async function verificarAutenticacion(): Promise<ResultadoAutenticacion> {
	const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/auth/me`, {
		method: "GET",
	});
	if (res.status === 401) return { autenticado: false };
	if (!res.ok)
		throw new Error(
			await extraerMensajeError(res, "No se pudo verificar la sesión"),
		);

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
	await fetchSeguro(`${entorno.VITE_API_BASE_URL}/auth/logout`, {
		method: "POST",
	});
}

export async function verificarPasswordActual(password: string): Promise<void> {
	const res = await fetchSeguro(
		`${entorno.VITE_API_BASE_URL}/auth/verificar-password`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password }),
		},
	);

	if (!res.ok) {
		const msj = await extraerMensajeError(
			res,
			"La contraseña actual es incorrecta",
		);
		throw new Error(msj);
	}
}

export async function cambiarPassword(
	passwordActual: string,
	passwordNueva: string,
): Promise<void> {
	const res = await fetchSeguro(
		`${entorno.VITE_API_BASE_URL}/auth/cambiar-password`,
		{
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ passwordActual, passwordNueva }),
		},
	);

	if (!res.ok) {
		const msj = await extraerMensajeError(
			res,
			"Hubo un error al actualizar la contraseña",
		);
		throw new Error(msj);
	}
}
