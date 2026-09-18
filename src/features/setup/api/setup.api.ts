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
		if (!res.ok) return false;

		const wrapper = await parsearJsonSeguro<{ datos: unknown }>(res);
		const parsed = EstadoSetupRespuestaSchema.safeParse(wrapper.datos);

		if (parsed.success) {
			return parsed.data.configurado;
		}

		return false;
	} catch (_e) {
		return false;
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
