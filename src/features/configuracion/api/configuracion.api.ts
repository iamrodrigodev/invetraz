import { entorno } from "../../../config/entorno";
import { leerDatos } from "../../../utils/api";
import { extraerMensajeError, fetchSeguro } from "../../../utils/fetch";
import {
	type ActualizarCredencialesPeticion,
	type ConfiguracionRespuesta,
	ConfiguracionRespuestaSchema,
	type ResultadoVerificacion,
	ResultadoVerificacionSchema,
} from "../types/ActualizarCredencialesPeticion";

export async function obtenerConfiguracion(): Promise<ConfiguracionRespuesta> {
	const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/configuracion`, {
		method: "GET",
	});

	return leerDatos(
		res,
		ConfiguracionRespuestaSchema,
		"Error al obtener la configuración del sistema",
	);
}

export async function actualizarConfiguracion(
	peticion: ActualizarCredencialesPeticion,
): Promise<void> {
	const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/configuracion`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
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

export async function verificarConfiguracion(
	peticion?: ActualizarCredencialesPeticion,
): Promise<ResultadoVerificacion> {
	const init: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	};

	if (peticion) {
		init.body = JSON.stringify(peticion);
	}

	const res = await fetchSeguro(
		`${entorno.VITE_API_BASE_URL}/configuracion/verificar`,
		init,
	);

	return leerDatos(
		res,
		ResultadoVerificacionSchema,
		"No se pudo verificar la conexión con Google Classroom",
	);
}
