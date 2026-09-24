import { useCallback, useEffect, useRef, useState } from "react";
import {
	generarActividadSeguimientoApi,
	obtenerTemasClase,
} from "@/features/actividades/api/actividades.api.ts";
import { useClasesDocenteStore } from "@/features/actividades/store/useClasesDocenteStore.ts";
import { usePlantillasSeguimientoStore } from "@/features/actividades/store/usePlantillasSeguimientoStore.ts";
import type {
	FormGenerarActividadValores,
	TemaClase,
} from "@/features/actividades/types/actividades.types.ts";
import {
	esConfiguracionListaParaActividades,
	useConfiguracionStore,
} from "@/features/configuracion/store/useConfiguracionStore.ts";

export interface CarpetaDriveInfo {
	id: string;
	nombre: string;
}

export function useGenerarActividad(activo = false) {
	const {
		credenciales,
		estadoConexion,
		cargado: configuracionCargada,
		cargando: configuracionCargando,
		cargarConfiguracion,
	} = useConfiguracionStore();

	const {
		plantillas,
		cargando: cargandoPlantillas,
		cargado: plantillasCargadas,
		cargarPlantillas,
	} = usePlantillasSeguimientoStore();

	const {
		clases,
		cargando: cargandoClases,
		cargado: clasesCargadas,
		cargarClases,
	} = useClasesDocenteStore();

	const [temas, setTemas] = useState<TemaClase[]>([]);
	const [cargandoTemas, setCargandoTemas] = useState(false);
	const [generando, setGenerando] = useState(false);

	useEffect(() => {
		if (!activo) {
			return;
		}

		if (!(configuracionCargada || configuracionCargando)) {
			cargarConfiguracion().catch(() => {});
		}

		if (!(plantillasCargadas || cargandoPlantillas)) {
			cargarPlantillas().catch(() => {});
		}

		if (!(clasesCargadas || cargandoClases)) {
			cargarClases().catch(() => {});
		}
	}, [
		activo,
		configuracionCargada,
		configuracionCargando,
		cargarConfiguracion,
		plantillasCargadas,
		cargandoPlantillas,
		cargarPlantillas,
		clasesCargadas,
		cargandoClases,
		cargarClases,
	]);

	const ultimaClaseTemasRef = useRef<string>("");

	const cargarTemasDeClase = useCallback((idClase: string) => {
		if (!idClase) {
			ultimaClaseTemasRef.current = "";
			setTemas([]);
			setCargandoTemas(false);
			return;
		}

		ultimaClaseTemasRef.current = idClase;
		setCargandoTemas(true);

		obtenerTemasClase(idClase)
			.then((temasObtenidos) => {
				if (ultimaClaseTemasRef.current === idClase) {
					setTemas(temasObtenidos);
				}
			})
			.catch(() => {
				if (ultimaClaseTemasRef.current === idClase) {
					setTemas([]);
				}
			})
			.finally(() => {
				if (ultimaClaseTemasRef.current === idClase) {
					setCargandoTemas(false);
				}
			});
	}, []);

	const configuracionValida = esConfiguracionListaParaActividades(credenciales, estadoConexion);

	const ejecutarGeneracion = useCallback(
		async (datos: FormGenerarActividadValores): Promise<boolean> => {
			if (!configuracionValida) {
				return false;
			}
			setGenerando(true);
			try {
				return await generarActividadSeguimientoApi(datos);
			} catch {
				return false;
			} finally {
				setGenerando(false);
			}
		},
		[configuracionValida],
	);

	const carpetaDrive: CarpetaDriveInfo = {
		id: credenciales.googleDriveFolderId || "",
		nombre:
			credenciales.googleDriveFolderName ||
			(credenciales.googleDriveFolderId ? "Carpeta de Investigación" : ""),
	};

	return {
		clases,
		plantillas,
		temas,
		carpetaDrive,
		configuracionValida,
		cargandoClases,
		cargandoPlantillas,
		cargandoTemas,
		generando,
		cargarTemasDeClase,
		cargarPlantillas,
		cargarClases,
		ejecutarGeneracion,
	};
}
