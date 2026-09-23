import { create } from "zustand";
import { obtenerClasesDocente } from "@/features/actividades/api/actividades.api.ts";
import type { ClaseDocente } from "@/features/actividades/types/actividades.types.ts";
import { registrarLimpiadorSesion } from "@/utils/eventosSesion.ts";

interface ClasesDocenteState {
	clases: ClaseDocente[];
	cargando: boolean;
	cargado: boolean;
	error: string | null;
	cargarClases: (forzar?: boolean) => Promise<ClaseDocente[]>;
	limpiar: () => void;
}

export const useClasesDocenteStore = create<ClasesDocenteState>((set, get) => ({
	clases: [],
	cargando: false,
	cargado: false,
	error: null,

	cargarClases: async (forzar = false) => {
		const { cargado, cargando, clases } = get();
		if (cargado && !forzar) {
			return clases;
		}
		if (cargando) {
			return clases;
		}

		set({ cargando: true, error: null });
		try {
			const datos = await obtenerClasesDocente();
			set({ clases: datos, cargado: true, cargando: false, error: null });
			return datos;
		} catch (error) {
			const mensaje =
				error instanceof Error ? error.message : "Error al cargar las clases del docente";
			set({ cargando: false, error: mensaje });
			throw error;
		}
	},

	limpiar: () => {
		set({ clases: [], cargando: false, cargado: false, error: null });
	},
}));

registrarLimpiadorSesion(() => {
	useClasesDocenteStore.getState().limpiar();
});
