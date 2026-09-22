import { entorno } from "../../../config/entorno";
import { ejecutarPeticion } from "../../../utils/api";
import {
	type CarpetaPlantillasRespuesta,
	CarpetaPlantillasRespuestaSchema,
	type VincularCarpetaPeticion,
} from "../types/plantillas.types";

export async function obtenerPlantillas(): Promise<CarpetaPlantillasRespuesta> {
	return ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/plantillas`,
		{ method: "GET" },
		CarpetaPlantillasRespuestaSchema,
		"Error al consultar las plantillas de seguimiento",
	);
}

export async function verificarCarpetaDrive(
	peticion: VincularCarpetaPeticion,
): Promise<CarpetaPlantillasRespuesta> {
	return ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/plantillas/verificar`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(peticion),
		},
		CarpetaPlantillasRespuestaSchema,
		"Error al verificar la carpeta de Google Drive",
	);
}

export async function vincularCarpetaDrive(
	peticion: VincularCarpetaPeticion,
): Promise<CarpetaPlantillasRespuesta> {
	return ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/plantillas/carpeta`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(peticion),
		},
		CarpetaPlantillasRespuestaSchema,
		"Error al vincular la carpeta de Google Drive",
	);
}
