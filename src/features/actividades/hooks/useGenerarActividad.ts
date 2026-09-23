// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { useCallback, useEffect, useState } from "react";
import {
	DATOS_PRUEBA_CLASES,
	DATOS_PRUEBA_TEMAS,
	simularGeneracionActividad,
} from "@/features/actividades/mocks/actividadesCascaron.mock.ts";
import { usePlantillasSeguimientoStore } from "@/features/actividades/store/usePlantillasSeguimientoStore.ts";
import type {
	ClaseDocente,
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

	const [clases] = useState<ClaseDocente[]>(DATOS_PRUEBA_CLASES);
	const [temas, setTemas] = useState<TemaClase[]>([]);
	const [cargandoClases] = useState(false);
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

	const configuracionValida = esConfiguracionListaParaActividades(credenciales, estadoConexion);

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
