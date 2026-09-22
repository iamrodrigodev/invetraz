import { entorno } from "../../../config/entorno";
import { ejecutarAccion, ejecutarPeticion } from "../../../utils/api";
import {
	type ActualizarCredencialesPeticion,
	type ConfiguracionRespuesta,
	ConfiguracionRespuestaSchema,
	type ResultadoVerificacion,
	ResultadoVerificacionSchema,
} from "../types/ActualizarCredencialesPeticion";

export async function obtenerConfiguracion(): Promise<ConfiguracionRespuesta> {
	return ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/configuracion`,
		{ method: "GET" },
		ConfiguracionRespuestaSchema,
		"Error al obtener la configuración del sistema",
	);
}

export async function actualizarConfiguracion(
	peticion: ActualizarCredencialesPeticion,
): Promise<void> {
	return ejecutarAccion(
		`${entorno.VITE_API_BASE_URL}/configuracion`,
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
	return ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/configuracion/verificar`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			...(peticion ? { body: JSON.stringify(peticion) } : {}),
		},
		ResultadoVerificacionSchema,
		"No se pudo verificar la conexión con Google Classroom",
	);
}
