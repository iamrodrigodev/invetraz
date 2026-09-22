import { create } from "zustand";
import { registrarLimpiadorSesion } from "../../../utils/eventosSesion";
import { obtenerPlantillasParaFormulario } from "../api/actividades.api";
import type { PlantillaSeguimientoOpcion } from "../types/actividades.types";

interface PlantillasSeguimientoState {
	plantillas: PlantillaSeguimientoOpcion[];
	cargando: boolean;
	cargado: boolean;
	cargarPlantillas: (forzar?: boolean) => Promise<PlantillaSeguimientoOpcion[]>;
	limpiar: () => void;
}

export const usePlantillasSeguimientoStore = create<PlantillasSeguimientoState>(
	(set, get) => ({
		plantillas: [],
		cargando: false,
		cargado: false,

		cargarPlantillas: async (forzar = false) => {
			const { cargado, cargando, plantillas } = get();
			if (cargado && !forzar) {
				return plantillas;
			}
			if (cargando) {
				return plantillas;
			}

			set({ cargando: true });
			try {
				const datos = await obtenerPlantillasParaFormulario();
				set({ plantillas: datos, cargado: true, cargando: false });
				return datos;
			} catch (error) {
				set({ cargando: false });
				throw error;
			}
		},

		limpiar: () => {
			set({ plantillas: [], cargando: false, cargado: false });
		},
	}),
);

registrarLimpiadorSesion(() => {
	usePlantillasSeguimientoStore.getState().limpiar();
});
