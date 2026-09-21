import { entorno } from "../../../config/entorno";
import { crearApiRespuestaSchema } from "../../../schemas/api.schemas";
import {
	extraerMensajeError,
	fetchSeguro,
	parsearConEsquema,
} from "../../../utils/fetch";
import {
	type CarpetaPlantillasRespuesta,
	CarpetaPlantillasRespuestaSchema,
	type VincularCarpetaPeticion,
} from "../types/plantillas.types";

export async function obtenerPlantillas(): Promise<CarpetaPlantillasRespuesta> {
	const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/plantillas`, {
		method: "GET",
	});

	if (!res.ok) {
		const msj = await extraerMensajeError(
			res,
			"Error al consultar las plantillas de seguimiento",
		);
		throw new Error(msj);
	}

	const wrapperSchema = crearApiRespuestaSchema(
		CarpetaPlantillasRespuestaSchema,
	);
	const wrapper = await parsearConEsquema(res, wrapperSchema);
	return wrapper.datos;
}

export async function vincularCarpetaDrive(
	peticion: VincularCarpetaPeticion,
): Promise<CarpetaPlantillasRespuesta> {
	const res = await fetchSeguro(
		`${entorno.VITE_API_BASE_URL}/plantillas/carpeta`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(peticion),
		},
	);

	if (!res.ok) {
		const msj = await extraerMensajeError(
			res,
			"Error al vincular la carpeta de Google Drive",
		);
		throw new Error(msj);
	}

	const wrapperSchema = crearApiRespuestaSchema(
		CarpetaPlantillasRespuestaSchema,
	);
	const wrapper = await parsearConEsquema(res, wrapperSchema);
	return wrapper.datos;
}
