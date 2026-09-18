import { entorno } from "../../../config/entorno";
import { extraerMensajeError, fetchSeguro } from "../../../utils/fetch";
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

	const data = await res.json();
	return LoginRespuestaSchema.parse(data);
}

export async function verificarAutenticacion(): Promise<boolean> {
	try {
		const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/auth/me`, {
			method: "GET",
		});
		return res.ok;
	} catch (_error) {
		return false;
	}
}

export async function logout(): Promise<void> {
	await fetchSeguro(`${entorno.VITE_API_BASE_URL}/auth/logout`, {
		method: "POST",
	});
}
