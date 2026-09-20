import { entorno } from "../../../config/entorno";
import {
	crearApiRespuestaSchema,
	type LoginRespuesta,
	LoginRespuestaSchema,
	VerificarAutenticacionRespuestaSchema,
} from "../../../schemas/api.schemas";
import {
	extraerMensajeError,
	fetchSeguro,
	parsearConEsquema,
} from "../../../utils/fetch";
import type { LoginPeticion } from "../types/LoginPeticion";

export async function login(peticion: LoginPeticion): Promise<LoginRespuesta> {
	const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(peticion),
	});

	if (!res.ok) {
		const msj = await extraerMensajeError(res, "Credenciales inválidas");
		throw new Error(msj);
	}

	const wrapperSchema = crearApiRespuestaSchema(LoginRespuestaSchema);
	const wrapper = await parsearConEsquema(res, wrapperSchema);
	return wrapper.datos;
}

export interface ResultadoAutenticacion {
	autenticado: boolean;
	email?: string | null;
}

export async function verificarAutenticacion(): Promise<ResultadoAutenticacion> {
	try {
		const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/auth/me`, {
			method: "GET",
		});
		if (!res.ok) return { autenticado: false };

		const wrapperSchema = crearApiRespuestaSchema(
			VerificarAutenticacionRespuestaSchema,
		);
		const wrapper = await parsearConEsquema(res, wrapperSchema);
		return {
			autenticado: wrapper.datos.autenticado,
			email: wrapper.datos.email ?? null,
		};
	} catch (_error) {
		return { autenticado: false };
	}
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
