import { create } from "zustand";
import { logout, verificarAutenticacion } from "../features/auth/api/auth.api";
import { useConfiguracionStore } from "../features/configuracion/store/useConfiguracionStore";
import { verificarEstadoSistema } from "../features/setup/api/setup.api";
import { alExpirarSesion } from "../utils/fetch";

interface AppState {
	configurado: boolean | null;
	autenticado: boolean | null;
	usuarioEmail: string | null;
	estadoVerificado: boolean;
	verificarEstadoGlobal: () => Promise<void>;
	setConfigurado: (valor: boolean) => void;
	setAutenticado: (valor: boolean, email?: string | null) => void;
	cerrarSesion: () => Promise<void>;
}

const configuradoCacheado =
	typeof window !== "undefined" &&
	localStorage.getItem("sistema_configurado") === "true";
const sesionPreviaActiva =
	typeof window !== "undefined" &&
	localStorage.getItem("sesion_activa") === "true";
const usuarioEmailCacheado =
	typeof window !== "undefined" ? localStorage.getItem("usuario_email") : null;

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
				localStorage.setItem("sesion_activa", "true");
				if (resAuth.email) {
					localStorage.setItem("usuario_email", resAuth.email);
				}
			} else {
				localStorage.removeItem("sesion_activa");
				localStorage.removeItem("usuario_email");
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
			localStorage.removeItem("sesion_activa");
			localStorage.removeItem("usuario_email");
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
	setAutenticado: (valor: boolean, email?: string | null) => {
		if (valor) {
			localStorage.setItem("sesion_activa", "true");
			if (email) {
				localStorage.setItem("usuario_email", email);
			}
		} else {
			localStorage.removeItem("sesion_activa");
			localStorage.removeItem("usuario_email");
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
		localStorage.removeItem("sesion_activa");
		localStorage.removeItem("usuario_email");
		localStorage.removeItem("jwt");
		localStorage.removeItem("moduloActivo");
		useConfiguracionStore.getState().limpiar();
		set({ autenticado: false, usuarioEmail: null });
	},
}));

alExpirarSesion(() => {
	localStorage.removeItem("usuario_email");
	useAppStore.setState({ autenticado: false, usuarioEmail: null });
	useConfiguracionStore.getState().limpiar();
});
