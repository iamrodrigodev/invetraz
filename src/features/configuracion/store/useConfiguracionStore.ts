import { create } from "zustand";
import {
	actualizarConfiguracion,
	obtenerConfiguracion,
	verificarConfiguracion,
} from "../api/configuracion.api";
import type { TipoEstadoConexion } from "../components";
import type {
	ActualizarCredencialesPeticion,
	ResultadoVerificacion,
} from "../types/ActualizarCredencialesPeticion";

export function sonCredencialesIguales(
	a: ActualizarCredencialesPeticion | null | undefined,
	b: ActualizarCredencialesPeticion | null | undefined,
): boolean {
	if (!a || !b) return false;
	return (
		a.googleClientId.trim() === b.googleClientId.trim() &&
		a.googleClientSecret.trim() === b.googleClientSecret.trim() &&
		a.googleRefreshToken.trim() === b.googleRefreshToken.trim()
	);
}

export function tieneCredencialesCompletas(
	c: ActualizarCredencialesPeticion | null | undefined,
): boolean {
	if (!c) return false;
	return Boolean(
		c.googleClientId?.trim() &&
			c.googleClientSecret?.trim() &&
			c.googleRefreshToken?.trim(),
	);
}

export interface EstadoConexionContexto {
	credencialesGuardadas: ActualizarCredencialesPeticion;
	credencialesVerificadas: ActualizarCredencialesPeticion | null;
	credencialesFallidas: ActualizarCredencialesPeticion | null;
	valoresActuales: ActualizarCredencialesPeticion;
	verificando: boolean;
	guardando: boolean;
	camposCompletos: boolean;
	tieneErrores: boolean;
}

export function resolverEstadoConexion(
	ctx: EstadoConexionContexto,
): TipoEstadoConexion {
	if (ctx.verificando || ctx.guardando) {
		return "verificando";
	}
	if (!ctx.camposCompletos || ctx.tieneErrores) {
		return "no_configurado";
	}
	if (sonCredencialesIguales(ctx.credencialesFallidas, ctx.valoresActuales)) {
		return "error";
	}
	if (
		sonCredencialesIguales(ctx.credencialesVerificadas, ctx.valoresActuales)
	) {
		return "conectado";
	}
	return "no_configurado";
}

interface ConfiguracionState {
	credenciales: ActualizarCredencialesPeticion;
	credencialesVerificadas: ActualizarCredencialesPeticion | null;
	credencialesFallidas: ActualizarCredencialesPeticion | null;
	estadoConexion: TipoEstadoConexion;
	cargado: boolean;
	cargando: boolean;
	cargarConfiguracion: (
		forzar?: boolean,
	) => Promise<ActualizarCredencialesPeticion>;
	guardarConfiguracion: (
		datos: ActualizarCredencialesPeticion,
	) => Promise<ResultadoVerificacion>;
	verificarConexion: (
		datos?: ActualizarCredencialesPeticion,
	) => Promise<ResultadoVerificacion>;
	setEstadoConexion: (estado: TipoEstadoConexion) => void;
	limpiar: () => void;
}

const VALORES_POR_DEFECTO: ActualizarCredencialesPeticion = {
	googleClientId: "",
	googleClientSecret: "",
	googleRefreshToken: "",
};

export const useConfiguracionStore = create<ConfiguracionState>((set, get) => ({
	credenciales: VALORES_POR_DEFECTO,
	credencialesVerificadas: null,
	credencialesFallidas: null,
	estadoConexion: "no_configurado",
	cargado: false,
	cargando: false,

	cargarConfiguracion: async (forzar = false) => {
		const { cargado, cargando, credenciales } = get();
		if (cargado && !forzar) {
			return credenciales;
		}
		if (cargando) {
			return credenciales;
		}

		set({ cargando: true });
		try {
			const config = await obtenerConfiguracion();
			const nuevasCredenciales: ActualizarCredencialesPeticion = {
				googleClientId: config.googleClientId || "",
				googleClientSecret: config.googleClientSecret || "",
				googleRefreshToken: config.googleRefreshToken || "",
			};

			const tieneCredenciales = Boolean(
				nuevasCredenciales.googleClientId &&
					nuevasCredenciales.googleClientSecret &&
					nuevasCredenciales.googleRefreshToken,
			);

			set({
				credenciales: nuevasCredenciales,
				credencialesVerificadas: tieneCredenciales ? nuevasCredenciales : null,
				credencialesFallidas: null,
				estadoConexion: tieneCredenciales ? "conectado" : "no_configurado",
				cargado: true,
				cargando: false,
			});

			return nuevasCredenciales;
		} catch (error) {
			set({ cargando: false });
			throw error;
		}
	},

	guardarConfiguracion: async (datos: ActualizarCredencialesPeticion) => {
		set({ cargando: true, estadoConexion: "verificando" });
		try {
			const resVerificacion = await verificarConfiguracion(datos);
			await actualizarConfiguracion(datos);

			set({
				credenciales: datos,
				credencialesVerificadas: datos,
				credencialesFallidas: null,
				estadoConexion: "conectado",
				cargado: true,
				cargando: false,
			});

			return resVerificacion;
		} catch (error) {
			set({
				credencialesVerificadas: null,
				credencialesFallidas: datos,
				estadoConexion: "error",
				cargando: false,
			});
			throw error;
		}
	},

	verificarConexion: async (datos?: ActualizarCredencialesPeticion) => {
		const creds = datos || get().credenciales;
		set({ estadoConexion: "verificando" });
		try {
			const res = await verificarConfiguracion(creds);
			set({
				credencialesVerificadas: creds,
				credencialesFallidas: null,
				estadoConexion: "conectado",
			});
			return res;
		} catch (error) {
			set({
				credencialesVerificadas: null,
				credencialesFallidas: creds,
				estadoConexion: "error",
			});
			throw error;
		}
	},

	setEstadoConexion: (estado: TipoEstadoConexion) => {
		set({ estadoConexion: estado });
	},

	limpiar: () => {
		set({
			credenciales: VALORES_POR_DEFECTO,
			credencialesVerificadas: null,
			credencialesFallidas: null,
			estadoConexion: "no_configurado",
			cargado: false,
			cargando: false,
		});
	},
}));
