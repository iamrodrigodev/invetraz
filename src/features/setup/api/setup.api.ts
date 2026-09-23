import { entorno } from "@/config/entorno.ts";
import type { CrearAdminPeticion } from "@/features/setup/types/CrearAdminPeticion.ts";
import { EstadoSetupRespuestaSchema } from "@/schemas/api.schemas.ts";
import { ejecutarAccion, ejecutarPeticion } from "@/utils/api.ts";

export async function verificarEstadoSistema(): Promise<boolean> {
	const datos = await ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/setup/estado`,
		{ method: "GET" },
		EstadoSetupRespuestaSchema,
		"No se pudo consultar el estado del sistema",
	);
	if (typeof window !== "undefined") {
		if (datos.configurado) {
			localStorage.setItem("sistema_configurado", "true");
		} else {
			localStorage.removeItem("sistema_configurado");
		}
	}
	return datos.configurado;
}

export async function crearAdmin(
	peticion: Omit<CrearAdminPeticion, "confirmPassword">,
): Promise<void> {
	return ejecutarAccion(
		`${entorno.VITE_API_BASE_URL}/setup/crear-admin`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(peticion),
		},
		"Error al crear la cuenta de administrador",
	);
}
