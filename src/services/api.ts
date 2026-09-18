import { entorno } from "../entorno";
import {
	type ActualizarCredencialesPeticion,
	type CrearAdminPeticion,
	type LoginPeticion,
	type LoginRespuesta,
	EstadoSetupRespuestaSchema,
	LoginRespuestaSchema,
} from "../types";

function getAuthHeaders(): HeadersInit {
	const token = localStorage.getItem("jwt");
	return token ? { Authorization: "Bearer " + token } : {};
}

export async function verificarEstadoSistema(): Promise<boolean> {
	const res = await fetch(entorno.VITE_API_BASE_URL + "/setup/estado");
	if (!res.ok) return false;

	const data = await res.json();
	const parsed = EstadoSetupRespuestaSchema.safeParse(data);

	if (parsed.success) {
		return parsed.data.configurado;
	}

	return false;
}

export async function crearAdmin(peticion: CrearAdminPeticion): Promise<void> {
	const res = await fetch(entorno.VITE_API_BASE_URL + "/setup/crear-admin", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(peticion),
	});

	if (!res.ok) {
		throw new Error("Error al crear la cuenta de administrador");
	}
}

export async function login(peticion: LoginPeticion): Promise<LoginRespuesta> {
	const res = await fetch(entorno.VITE_API_BASE_URL + "/auth/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(peticion),
	});

	if (!res.ok) {
		throw new Error("Credenciales inválidas");
	}

	const data = await res.json();
	return LoginRespuestaSchema.parse(data);
}

export async function actualizarConfiguracion(
	peticion: ActualizarCredencialesPeticion,
): Promise<void> {
	const res = await fetch(entorno.VITE_API_BASE_URL + "/configuracion", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeaders(),
		},
		body: JSON.stringify(peticion),
	});

	if (!res.ok) {
		throw new Error("Error al actualizar las credenciales de Google");
	}
}
