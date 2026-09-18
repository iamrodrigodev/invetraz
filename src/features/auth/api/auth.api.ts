import { entorno } from "../../../config/entorno";
import {
	extraerMensajeError,
	fetchSeguro,
	parsearJsonSeguro,
} from "../../../utils/fetch";
import type { LoginPeticion } from "../types/LoginPeticion";
import {
	type LoginRespuesta,
	LoginRespuestaSchema,
} from "../types/LoginRespuesta";

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

	const wrapper = await parsearJsonSeguro<{ datos: unknown }>(res);
	return LoginRespuestaSchema.parse(wrapper.datos);
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
		const wrapper = await res.json();
		return {
			autenticado: wrapper.datos?.autenticado === true,
			email: wrapper.datos?.email || null,
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
