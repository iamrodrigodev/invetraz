import { obtenerApiBaseUrl } from "@/config/entorno.ts";
import type {
	CarpetaPlantillasRespuesta,
	VincularCarpetaPeticion,
} from "@/features/plantillas/types/plantillas.types.ts";
import { CarpetaPlantillasRespuestaSchema } from "@/features/plantillas/types/plantillas.types.ts";
import { ejecutarPeticion } from "@/utils/api.ts";

export async function obtenerPlantillas(): Promise<CarpetaPlantillasRespuesta> {
	const apiBaseUrl = obtenerApiBaseUrl();
	return ejecutarPeticion(
		`${apiBaseUrl}/plantillas`,
		{ method: "GET" },
		CarpetaPlantillasRespuestaSchema,
		"Error al consultar las plantillas de seguimiento",
	);
}

export async function verificarCarpetaDrive(
	peticion: VincularCarpetaPeticion,
): Promise<CarpetaPlantillasRespuesta> {
	const apiBaseUrl = obtenerApiBaseUrl();
	return ejecutarPeticion(
		`${apiBaseUrl}/plantillas/verificar`,
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
	const apiBaseUrl = obtenerApiBaseUrl();
	return ejecutarPeticion(
		`${apiBaseUrl}/plantillas/carpeta`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(peticion),
		},
		CarpetaPlantillasRespuestaSchema,
		"Error al vincular la carpeta de Google Drive",
	);
}
