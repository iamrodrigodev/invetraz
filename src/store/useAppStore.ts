import { create } from "zustand";
import { verificarEstadoSistema } from "../features/setup/api/setup.api";

interface AppState {
	configurado: boolean | null;
	estadoVerificado: boolean;
	verificarEstado: () => Promise<void>;
	setConfigurado: (valor: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
	configurado: null,
	estadoVerificado: false,
	verificarEstado: async () => {
		try {
			const esConfigurado = await verificarEstadoSistema();
			set({ configurado: esConfigurado, estadoVerificado: true });
		} catch (error) {
			console.error("Error al verificar estado", error);
			set({ configurado: false, estadoVerificado: true });
		}
	},
	setConfigurado: (valor: boolean) => set({ configurado: valor }),
}));
