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

interface ConfiguracionState {
	credenciales: ActualizarCredencialesPeticion;
	estadoConexion: TipoEstadoConexion;
	cargado: boolean;
	cargando: boolean;
	cargarConfiguracion: (
		forzar?: boolean,
	) => Promise<ActualizarCredencialesPeticion>;
	guardarConfiguracion: (
		datos: ActualizarCredencialesPeticion,
	) => Promise<void>;
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
		set({ cargando: true });
		try {
			await actualizarConfiguracion(datos);
			set({
				credenciales: datos,
				estadoConexion: "conectado",
				cargado: true,
				cargando: false,
			});
		} catch (error) {
			set({ cargando: false });
			throw error;
		}
	},

	verificarConexion: async (datos?: ActualizarCredencialesPeticion) => {
		const creds = datos || get().credenciales;
		set({ estadoConexion: "verificando" });
		try {
			const res = await verificarConfiguracion(creds);
			set({ estadoConexion: "conectado" });
			return res;
		} catch (error) {
			set({ estadoConexion: "error" });
			throw error;
		}
	},

	setEstadoConexion: (estado: TipoEstadoConexion) => {
		set({ estadoConexion: estado });
	},

	limpiar: () => {
		set({
			credenciales: VALORES_POR_DEFECTO,
			estadoConexion: "no_configurado",
			cargado: false,
			cargando: false,
		});
	},
}));
