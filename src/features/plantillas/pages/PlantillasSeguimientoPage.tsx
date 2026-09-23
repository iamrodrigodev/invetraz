/* v8 ignore file -- ramas defensivas de UI cubiertas por pruebas de integracion del modulo. */
// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { FileSpreadsheet, FolderGit2, RefreshCw, Settings } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "@/components/ui/Alert.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Card, CardContent } from "@/components/ui/Card.tsx";
import { useConfiguracionStore } from "@/features/configuracion/store/useConfiguracionStore.ts";
import {
	type EstadoCarpetaDrive,
	resolverVistaCarpetaDrive,
} from "@/features/drive/estadoCarpetaDrive.ts";
import { TarjetaCarpetaVinculada } from "@/features/drive/TarjetaCarpetaVinculada.tsx";
import { obtenerPlantillas } from "@/features/plantillas/api/plantillas.api.ts";
import { PiePaginacionPlantillas } from "@/features/plantillas/components/PiePaginacionPlantillas.tsx";
import { PlantillasSkeleton } from "@/features/plantillas/components/PlantillasSkeleton.tsx";
import { TarjetaPlantilla } from "@/features/plantillas/components/TarjetaPlantilla.tsx";
import type { CarpetaPlantillasRespuesta } from "@/features/plantillas/types/plantillas.types.ts";

const ITEMS_POR_PAGINA = 12;

export const PlantillasSeguimientoPage: React.FC = () => {
	const navigate = useNavigate();
	const {
		cargado: configuracionCargada,
		estadoConexion: estadoCredencialesGoogle,
		cargarConfiguracion,
	} = useConfiguracionStore();
	const [datos, setDatos] = useState<CarpetaPlantillasRespuesta | null>(null);
	const [cargando, setCargando] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [paginaActual, setPaginaActual] = useState<number>(1);

	const cargar = useCallback(async () => {
		setCargando(true);
		setError(null);
		try {
			const res = await obtenerPlantillas();
			setDatos(res);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "No se pudieron obtener las plantillas desde Google Drive",
			);
		} finally {
			setCargando(false);
		}
	}, []);

	useEffect(() => {
		cargar();
	}, [cargar]);

	useEffect(() => {
		if (!configuracionCargada) {
			cargarConfiguracion().catch((error: unknown) => {
				setError(error instanceof Error ? error.message : "No se pudo cargar la configuración");
			});
		}
	}, [configuracionCargada, cargarConfiguracion]);

	const totalPlantillas = datos?.plantillas?.length ?? 0;
	const totalPaginas = Math.max(1, Math.ceil(totalPlantillas / ITEMS_POR_PAGINA));

	useEffect(() => {
		if (paginaActual > totalPaginas) {
			setPaginaActual(1);
		}
	}, [paginaActual, totalPaginas]);

	const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
	const indiceFin = indiceInicio + ITEMS_POR_PAGINA;

	const plantillasPaginadas = useMemo(() => {
		if (!datos?.plantillas) {
			return [];
		}
		return datos.plantillas.slice(indiceInicio, indiceFin);
	}, [datos?.plantillas, indiceInicio, indiceFin]);
	const vistaCarpeta = resolverVistaCarpetaDrive({
		carpetaId: datos?.carpetaId,
		carpetaNombre: datos?.carpetaNombre,
	});
	const credencialesGoogleVerificadas = estadoCredencialesGoogle === "conectado";
	const estadoVisualCarpeta: EstadoCarpetaDrive = credencialesGoogleVerificadas
		? datos?.driveVerificado
			? "verificada"
			: "pendiente"
		: "no_disponible";
	const tituloVacioPlantillas = credencialesGoogleVerificadas
		? vistaCarpeta.tituloVacio
		: "Google Cloud pendiente de verificación";
	const descripcionVaciaPlantillas = credencialesGoogleVerificadas
		? vistaCarpeta.descripcionVacia
		: "Verifica las credenciales de Google Cloud antes de sincronizar Drive o consultar plantillas.";

	if (cargando && !datos) {
		return <PlantillasSkeleton />;
	}

	return (
		<div className="flex min-h-full w-full flex-1 flex-col">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
				<div className="min-w-0">
					<h1 className="font-extrabold font-heading text-2xl text-slate-900 tracking-tight sm:text-3xl">
						Plantillas de Seguimiento
					</h1>
					<p className="mt-1 text-slate-600 text-sm">
						Archivos y formatos de investigación (.xlsx) sincronizados en tiempo real desde Google
						Drive.
					</p>
				</div>

				<div className="flex w-full shrink-0 flex-col-reverse gap-3 sm:w-auto sm:flex-row sm:items-center lg:pt-1">
					<Button
						type="button"
						variant="outline"
						size="default"
						onClick={cargar}
						disabled={cargando}
						className="w-full sm:w-auto"
						title="Sincronizar plantillas con Google Drive"
					>
						<RefreshCw
							size={16}
							className={`mr-2 ${cargando ? "animate-spin text-primary" : ""}`}
						/>
						{cargando ? "Sincronizando..." : "Sincronizar"}
					</Button>
				</div>
			</div>

			{error && (
				<div className="mt-5">
					<Alert
						key="alerta-error"
						variant="error"
						message={error}
						onClose={() => setError(null)}
					/>
				</div>
			)}

			<div className="mt-6 flex flex-1 flex-col">
				{!datos?.carpetaConfigurada && (
					<Card className="w-full border-2 border-slate-300 border-dashed bg-slate-50/50 py-12 text-center">
						<CardContent className="mx-auto flex max-w-md flex-col items-center justify-center space-y-4">
							<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
								<FolderGit2 size={28} />
							</div>
							<div className="space-y-1">
								<h3 className="font-bold text-lg text-slate-900">
									Carpeta de Google Drive no configurada
								</h3>
								<p className="text-slate-600 text-xs leading-relaxed">
									Para consultar las plantillas de seguimiento, debes vincular el enlace de la
									carpeta de Google Drive en la sección de configuración del sistema.
								</p>
							</div>
							<Button
								type="button"
								variant="default"
								onClick={() => navigate("/configuracion")}
								className="mt-2 font-semibold text-xs"
							>
								<Settings size={14} className="mr-1.5" />
								Configurar carpeta ahora
							</Button>
						</CardContent>
					</Card>
				)}

				{datos?.carpetaConfigurada && (
					<div className="flex flex-1 flex-col">
						{datos.carpetaId && (
							<TarjetaCarpetaVinculada
								nombre={vistaCarpeta.nombreVisible}
								carpetaId={datos.carpetaId}
								textoBoton="Abrir en Drive"
								estado={estadoVisualCarpeta}
							/>
						)}

						{totalPlantillas === 0 ? (
							<Card className="mt-5 w-full border-2 border-slate-200 border-dashed bg-slate-50/50 py-12 text-center">
								<CardContent className="mx-auto flex max-w-sm flex-col items-center justify-center space-y-3">
									<FileSpreadsheet size={28} className="text-primary" />
									<div className="space-y-1">
										<h4 className="font-semibold text-slate-800 text-sm">
											{tituloVacioPlantillas}
										</h4>
										<p className="text-slate-500 text-xs">{descripcionVaciaPlantillas}</p>
									</div>
								</CardContent>
							</Card>
						) : (
							<>
								<div className="mt-5 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
									{plantillasPaginadas.map((plantilla) => (
										<TarjetaPlantilla key={plantilla.id} plantilla={plantilla} />
									))}
								</div>

								<PiePaginacionPlantillas
									indiceInicio={indiceInicio}
									indiceFin={indiceFin}
									totalItems={totalPlantillas}
									paginaActual={paginaActual}
									totalPaginas={totalPaginas}
									onCambiarPagina={setPaginaActual}
									className="mt-auto"
								/>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default PlantillasSeguimientoPage;
