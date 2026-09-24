import { obtenerApiBaseUrl } from "@/config/entorno.ts";
import {
	type ActualizarCredencialesPeticion,
	type ConfiguracionRespuesta,
	ConfiguracionRespuestaSchema,
	type ResultadoVerificacion,
	ResultadoVerificacionSchema,
} from "@/features/configuracion/types/ActualizarCredencialesPeticion.ts";
import { ejecutarAccion, ejecutarPeticion } from "@/utils/api.ts";

export async function obtenerConfiguracion(): Promise<ConfiguracionRespuesta> {
	const apiBaseUrl = obtenerApiBaseUrl();
	return ejecutarPeticion(
		`${apiBaseUrl}/configuracion`,
		{ method: "GET" },
		ConfiguracionRespuestaSchema,
		"Error al obtener la configuración del sistema",
	);
}

export async function actualizarConfiguracion(
	peticion: ActualizarCredencialesPeticion,
): Promise<void> {
	const apiBaseUrl = obtenerApiBaseUrl();
	return ejecutarAccion(
		`${apiBaseUrl}/configuracion`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(peticion),
		},
		"Error al actualizar las credenciales de Google",
	);
}

export async function verificarConfiguracion(
	peticion?: ActualizarCredencialesPeticion,
): Promise<ResultadoVerificacion> {
	const apiBaseUrl = obtenerApiBaseUrl();
	return ejecutarPeticion(
		`${apiBaseUrl}/configuracion/verificar`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			...(peticion ? { body: JSON.stringify(peticion) } : {}),
		},
		ResultadoVerificacionSchema,
		"No se pudo verificar la conexión con Google Classroom",
	);
}
