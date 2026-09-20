import { create } from "zustand";
import { logout, verificarAutenticacion } from "../features/auth/api/auth.api";
import { verificarEstadoSistema } from "../features/setup/api/setup.api";
import { alExpirarSesion } from "../utils/fetch";

interface AppState {
	configurado: boolean | null;
	autenticado: boolean | null;
	usuarioEmail: string | null;
	estadoVerificado: boolean;
	verificarEstadoGlobal: () => Promise<void>;
	setConfigurado: (valor: boolean) => void;
	setAutenticado: (valor: boolean) => void;
	cerrarSesion: () => Promise<void>;
}

const configuradoCacheado =
	typeof window !== "undefined" &&
	localStorage.getItem("sistema_configurado") === "true";
const sesionPreviaActiva =
	typeof window !== "undefined" &&
	localStorage.getItem("sesion_activa") === "true";

export const useAppStore = create<AppState>((set) => ({
	configurado: configuradoCacheado ? true : null,
	autenticado: sesionPreviaActiva ? null : false,
	usuarioEmail: null,
	estadoVerificado: configuradoCacheado && !sesionPreviaActiva,
	verificarEstadoGlobal: async () => {
		try {
			const [esConfigurado, resAuth] = await Promise.all([
				verificarEstadoSistema(),
				verificarAutenticacion(),
			]);
			if (resAuth.autenticado) {
				localStorage.setItem("sesion_activa", "true");
			} else {
				localStorage.removeItem("sesion_activa");
			}
			set({
				configurado: esConfigurado,
				autenticado: resAuth.autenticado,
				usuarioEmail: resAuth.email || null,
				estadoVerificado: true,
			});
		} catch (error) {
			console.error("Error al verificar estado global", error);
			localStorage.removeItem("sesion_activa");
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
	setAutenticado: (valor: boolean) => {
		if (valor) {
			localStorage.setItem("sesion_activa", "true");
		} else {
			localStorage.removeItem("sesion_activa");
		}
		set({ autenticado: valor });
	},
	cerrarSesion: async () => {
		try {
			await logout();
		} catch (_error) {}
		localStorage.removeItem("sesion_activa");
		localStorage.removeItem("jwt");
		localStorage.removeItem("moduloActivo");
		set({ autenticado: false, usuarioEmail: null });
	},
}));

alExpirarSesion(() => {
	useAppStore.setState({ autenticado: false, usuarioEmail: null });
});
