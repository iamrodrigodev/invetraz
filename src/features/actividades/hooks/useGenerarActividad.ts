import { useCallback, useEffect, useState } from "react";
import {
	DATOS_PRUEBA_CLASES,
	DATOS_PRUEBA_TEMAS,
	simularGeneracionActividad,
} from "@/features/actividades/mocks/actividadesCascaron.mock";
import { usePlantillasSeguimientoStore } from "@/features/actividades/store/usePlantillasSeguimientoStore";
import type {
	ClaseDocente,
	FormGenerarActividadValores,
	TemaClase,
} from "@/features/actividades/types/actividades.types";
import {
	esConfiguracionListaParaActividades,
	useConfiguracionStore,
} from "@/features/configuracion/store/useConfiguracionStore";

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

	const [clases] = useState<ClaseDocente[]>(DATOS_PRUEBA_CLASES);
	const [temas, setTemas] = useState<TemaClase[]>([]);
	const [cargandoClases] = useState(false);
	const [cargandoTemas, setCargandoTemas] = useState(false);
	const [generando, setGenerando] = useState(false);

	useEffect(() => {
		if (!activo) return;

		if (!configuracionCargada && !configuracionCargando) {
			cargarConfiguracion().catch(() => {});
		}

		if (!plantillasCargadas && !cargandoPlantillas) {
			cargarPlantillas().catch(() => {});
		}
	}, [
		activo,
		configuracionCargada,
		configuracionCargando,
		cargarConfiguracion,
		plantillasCargadas,
		cargandoPlantillas,
		cargarPlantillas,
	]);

	const cargarTemasDeClase = useCallback((idClase: string) => {
		if (!idClase) {
			setTemas([]);
			return;
		}
		setCargandoTemas(true);
		const timerTemas = setTimeout(() => {
			const temasEncontrados = DATOS_PRUEBA_TEMAS[idClase] || [];
			setTemas(temasEncontrados);
			setCargandoTemas(false);
		}, 100);

		return () => clearTimeout(timerTemas);
	}, []);

	const configuracionValida = esConfiguracionListaParaActividades(
		credenciales,
		estadoConexion,
	);

	const ejecutarGeneracion = useCallback(
		async (datos: FormGenerarActividadValores): Promise<boolean> => {
			if (!configuracionValida) {
				return false;
			}
			setGenerando(true);
			try {
				return await simularGeneracionActividad(datos);
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
		ejecutarGeneracion,
	};
}
