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
	configurado: configuradoCacheado ? true : null,
	autenticado: sesionPreviaActiva ? null : false,
	usuarioEmail: usuarioEmailCacheado,
	estadoVerificado: configuradoCacheado && !sesionPreviaActiva,
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
			});
		} catch (error) {
			console.error("Error al verificar estado global", error);
			limpiarSesion();
			set({
				configurado: true,
				autenticado: false,
				usuarioEmail: null,
				estadoVerificado: true,
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
	useAppStore.setState({ autenticado: false, usuarioEmail: null });
	useConfiguracionStore.getState().limpiar();
});
