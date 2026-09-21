import { entorno } from "../../../config/entorno";
import { EstadoSetupRespuestaSchema } from "../../../schemas/api.schemas";
import { leerDatos } from "../../../utils/api";
import { extraerMensajeError, fetchSeguro } from "../../../utils/fetch";
import type { CrearAdminPeticion } from "../types/CrearAdminPeticion";

export async function verificarEstadoSistema(): Promise<boolean> {
	const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/setup/estado`);
	const datos = await leerDatos(
		res,
		EstadoSetupRespuestaSchema,
		"No se pudo consultar el estado del sistema",
	);
	if (typeof window !== "undefined") {
		if (datos.configurado) localStorage.setItem("sistema_configurado", "true");
		else localStorage.removeItem("sistema_configurado");
	}
	return datos.configurado;
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
