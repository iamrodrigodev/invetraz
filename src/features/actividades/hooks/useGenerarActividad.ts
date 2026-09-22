import { useCallback, useEffect, useState } from "react";
import {
	esConfiguracionListaParaActividades,
	useConfiguracionStore,
} from "../../configuracion/store/useConfiguracionStore";
import { obtenerPlantillasParaFormulario } from "../api/actividades.api";
import {
	DATOS_PRUEBA_CLASES,
	DATOS_PRUEBA_TEMAS,
	simularGeneracionActividad,
} from "../mocks/actividadesCascaron.mock";
import type {
	ClaseDocente,
	FormGenerarActividadValores,
	PlantillaSeguimientoOpcion,
	TemaClase,
} from "../types/actividades.types";

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

	const [clases] = useState<ClaseDocente[]>(DATOS_PRUEBA_CLASES);
	const [plantillas, setPlantillas] = useState<PlantillaSeguimientoOpcion[]>(
		[],
	);
	const [temas, setTemas] = useState<TemaClase[]>([]);
	const [cargandoClases] = useState(false);
	const [cargandoPlantillas, setCargandoPlantillas] = useState(false);
	const [cargandoTemas, setCargandoTemas] = useState(false);
	const [generando, setGenerando] = useState(false);

	const cargarPlantillas = useCallback(async () => {
		setCargandoPlantillas(true);
		try {
			const res = await obtenerPlantillasParaFormulario();
			setPlantillas(res);
		} catch {
			setPlantillas([]);
		} finally {
			setCargandoPlantillas(false);
		}
	}, []);

	useEffect(() => {
		if (!activo) return;

		if (!configuracionCargada && !configuracionCargando) {
			cargarConfiguracion().catch(() => {});
		}

		cargarPlantillas().catch(() => {});
	}, [
		activo,
		configuracionCargada,
		configuracionCargando,
		cargarConfiguracion,
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
