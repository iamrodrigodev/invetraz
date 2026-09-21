import { create } from "zustand";
import { logout, verificarAutenticacion } from "../features/auth/api/auth.api";
import { useConfiguracionStore } from "../features/configuracion/store/useConfiguracionStore";
import { verificarEstadoSistema } from "../features/setup/api/setup.api";
import { alExpirarSesion } from "../utils/fetch";
import {
	esSesionValida,
	guardarSesion,
	limpiarSesion,
	programarExpiracionAutomatica,
} from "../utils/sesion";

interface AppState {
	configurado: boolean | null;
	autenticado: boolean | null;
	usuarioEmail: string | null;
	estadoVerificado: boolean;
	errorVerificacion: string | null;
	verificarEstadoGlobal: () => Promise<void>;
	setConfigurado: (valor: boolean) => void;
	setAutenticado: (
		valor: boolean,
		email?: string | null,
		tokenAcceso?: string,
	) => void;
	cerrarSesion: () => Promise<void>;
}

const configuradoCacheado =
	typeof window !== "undefined" &&
	localStorage.getItem("sistema_configurado") === "true";
const sesionPreviaActiva = esSesionValida();
const usuarioEmailCacheado =
	typeof window !== "undefined" && sesionPreviaActiva
		? localStorage.getItem("usuario_email")
		: null;

function manejarExpiracionProactiva() {
	limpiarSesion("sesion_expirada");
	useAppStore.setState({ autenticado: false, usuarioEmail: null });
	useConfiguracionStore.getState().limpiar();
	if (typeof window !== "undefined" && window.location.pathname !== "/login") {
		window.location.replace("/login");
	}
}

if (sesionPreviaActiva) {
	programarExpiracionAutomatica(manejarExpiracionProactiva);
}

export const useAppStore = create<AppState>((set) => ({
	configurado: sesionPreviaActiva || configuradoCacheado ? true : null,
	autenticado: sesionPreviaActiva,
	usuarioEmail: usuarioEmailCacheado,
	estadoVerificado: Boolean(sesionPreviaActiva || configuradoCacheado),
	errorVerificacion: null,
	verificarEstadoGlobal: async () => {
		try {
			const [esConfigurado, resAuth] = await Promise.all([
				verificarEstadoSistema(),
				verificarAutenticacion(),
			]);
			if (resAuth.autenticado) {
				guardarSesion(undefined, resAuth.email);
			} else {
				const sesionEstabaActiva =
					typeof window !== "undefined" &&
					localStorage.getItem("sesion_activa") === "true";
				if (sesionEstabaActiva) {
					limpiarSesion("sesion_expirada");
				} else {
					limpiarSesion();
				}
			}
			set({
				configurado: esConfigurado,
				autenticado: resAuth.autenticado,
				usuarioEmail:
					resAuth.email ||
					(typeof window !== "undefined"
						? localStorage.getItem("usuario_email")
						: null),
				estadoVerificado: true,
				errorVerificacion: null,
			});
		} catch (error) {
			set({
				configurado: null,
				estadoVerificado: true,
				errorVerificacion:
					error instanceof Error
						? error.message
						: "No se pudo verificar el estado del sistema",
			});
		}
	},
	setConfigurado: (valor: boolean) => {
		if (valor && typeof window !== "undefined") {
			localStorage.setItem("sistema_configurado", "true");
		}
		set({ configurado: valor });
	},
	setAutenticado: (
		valor: boolean,
		email?: string | null,
		tokenAcceso?: string,
	) => {
		if (valor) {
			guardarSesion(tokenAcceso, email);
			programarExpiracionAutomatica(manejarExpiracionProactiva);
		} else {
			limpiarSesion();
		}
		set((state) => ({
			autenticado: valor,
			usuarioEmail: email !== undefined ? email : state.usuarioEmail,
		}));
	},
	cerrarSesion: async () => {
		try {
			await logout();
		} catch (_error) {}
		limpiarSesion();
		useConfiguracionStore.getState().limpiar();
		set({ autenticado: false, usuarioEmail: null });
	},
}));

alExpirarSesion(() => {
	manejarExpiracionProactiva();
});
