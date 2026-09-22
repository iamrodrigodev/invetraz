import { useCallback, useEffect, useState } from "react";
import { useConfiguracionStore } from "../../configuracion/store/useConfiguracionStore";
import {
	DATOS_PRUEBA_CARPETA,
	DATOS_PRUEBA_CLASES,
	DATOS_PRUEBA_PLANTILLAS,
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
	const { credenciales, cargarConfiguracion } = useConfiguracionStore();

	const [clases, setClases] = useState<ClaseDocente[]>([]);
	const [plantillas, setPlantillas] = useState<PlantillaSeguimientoOpcion[]>(
		[],
	);
	const [temas, setTemas] = useState<TemaClase[]>([]);
	const [cargandoClases, setCargandoClases] = useState(false);
	const [cargandoPlantillas, setCargandoPlantillas] = useState(false);
	const [cargandoTemas, setCargandoTemas] = useState(false);
	const [generando, setGenerando] = useState(false);

	useEffect(() => {
		if (!activo) return;

		cargarConfiguracion().catch(() => {});

		setCargandoClases(true);
		const timerClases = setTimeout(() => {
			setClases(DATOS_PRUEBA_CLASES);
			setCargandoClases(false);
		}, 100);

		setCargandoPlantillas(true);
		const timerPlantillas = setTimeout(() => {
			setPlantillas(DATOS_PRUEBA_PLANTILLAS);
			setCargandoPlantillas(false);
		}, 100);

		return () => {
			clearTimeout(timerClases);
			clearTimeout(timerPlantillas);
		};
	}, [activo, cargarConfiguracion]);

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

	const ejecutarGeneracion = useCallback(
		async (datos: FormGenerarActividadValores): Promise<boolean> => {
			setGenerando(true);
			try {
				return await simularGeneracionActividad(datos);
			} finally {
				setGenerando(false);
			}
		},
		[],
	);

	const carpetaDrive: CarpetaDriveInfo = {
		id: credenciales.googleDriveFolderId || DATOS_PRUEBA_CARPETA.id,
		nombre: credenciales.googleDriveFolderName || DATOS_PRUEBA_CARPETA.nombre,
	};

	return {
		clases,
		plantillas,
		temas,
		carpetaDrive,
		cargandoClases,
		cargandoPlantillas,
		cargandoTemas,
		generando,
		cargarTemasDeClase,
		ejecutarGeneracion,
	};
}
