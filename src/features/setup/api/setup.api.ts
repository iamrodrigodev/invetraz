import { entorno } from "../../../config/entorno";
import {
	crearApiRespuestaSchema,
	EstadoSetupRespuestaSchema,
} from "../../../schemas/api.schemas";
import {
	extraerMensajeError,
	fetchSeguro,
	parsearConEsquema,
} from "../../../utils/fetch";
import type { CrearAdminPeticion } from "../types/CrearAdminPeticion";

export async function verificarEstadoSistema(): Promise<boolean> {
	try {
		const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/setup/estado`);
		if (!res.ok) {
			return true;
		}

		const wrapperSchema = crearApiRespuestaSchema(EstadoSetupRespuestaSchema);
		const wrapper = await parsearConEsquema(res, wrapperSchema);
		return wrapper.datos.configurado;
	} catch (_e) {
		return true;
	}
}

export async function crearAdmin(
	peticion: Omit<CrearAdminPeticion, "confirmPassword">,
): Promise<void> {
	const res = await fetchSeguro(
		`${entorno.VITE_API_BASE_URL}/setup/crear-admin`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(peticion),
		},
	);

	if (!res.ok) {
		const msj = await extraerMensajeError(
			res,
			"Error al crear la cuenta de administrador",
		);
		throw new Error(msj);
	}
}
