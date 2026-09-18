import { entorno } from "../../../config/entorno";
import { extraerMensajeError, fetchSeguro } from "../../../utils/fetch";
import type { CrearAdminPeticion } from "../types/CrearAdminPeticion";
import { EstadoSetupRespuestaSchema } from "../types/EstadoSetupRespuesta";

export async function verificarEstadoSistema(): Promise<boolean> {
	const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/setup/estado`);
	if (!res.ok) return false;

	const data = await res.json();
	const parsed = EstadoSetupRespuestaSchema.safeParse(data);

	if (parsed.success) {
		return parsed.data.configurado;
	}

	return false;
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
