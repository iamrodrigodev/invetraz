import { entorno } from "../../../config/entorno";
import {
	extraerMensajeError,
	fetchSeguro,
	parsearJsonSeguro,
} from "../../../utils/fetch";
import type { CrearAdminPeticion } from "../types/CrearAdminPeticion";
import { EstadoSetupRespuestaSchema } from "../types/EstadoSetupRespuesta";

export async function verificarEstadoSistema(): Promise<boolean> {
	try {
		const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/setup/estado`);
		if (!res.ok) {
			// Si la base de datos está desconectada o el backend devuelve error,
			// asumimos configurado (true) para redirigir al login y no al setup
			return true;
		}

		const wrapper = await parsearJsonSeguro<{ datos: unknown }>(res);
		const parsed = EstadoSetupRespuestaSchema.safeParse(wrapper.datos);

		if (parsed.success) {
			return parsed.data.configurado;
		}

		return true;
	} catch (_e) {
		// Ante error de red o servidor apagado, asumir configurado (true) para ir al login
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
