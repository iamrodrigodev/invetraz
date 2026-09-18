import { entorno } from "../../../config/entorno";
import { extraerMensajeError, fetchSeguro } from "../../../utils/fetch";
import type { ActualizarCredencialesPeticion } from "../types/ActualizarCredencialesPeticion";

function getAuthHeaders(): HeadersInit {
	const token = localStorage.getItem("jwt");
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function actualizarConfiguracion(
	peticion: ActualizarCredencialesPeticion,
): Promise<void> {
	const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/configuracion`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeaders(),
		},
		body: JSON.stringify(peticion),
	});

	if (!res.ok) {
		const msj = await extraerMensajeError(
			res,
			"Error al actualizar las credenciales de Google",
		);
		throw new Error(msj);
	}
}
