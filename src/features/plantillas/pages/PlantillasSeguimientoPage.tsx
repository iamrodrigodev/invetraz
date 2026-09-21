import { FileSpreadsheet, FolderGit2, RefreshCw, Settings } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolverVistaCarpetaDrive } from "../../../components/drive/estadoCarpetaDrive";
import { TarjetaCarpetaVinculada } from "../../../components/drive/TarjetaCarpetaVinculada";
import {
	Alert,
	Button,
	Card,
	CardContent,
	PlantillasSkeleton,
} from "../../../components/ui";
import { obtenerPlantillas } from "../api/plantillas.api";
import { PiePaginacionPlantillas } from "../components/PiePaginacionPlantillas";
import { TarjetaPlantilla } from "../components/TarjetaPlantilla";
import type { CarpetaPlantillasRespuesta } from "../types/plantillas.types";

const ITEMS_POR_PAGINA = 12;

export const PlantillasSeguimientoPage: React.FC = () => {
	const navigate = useNavigate();
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
			setPaginaActual(1);
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

	const totalPlantillas = datos?.plantillas?.length ?? 0;
	const totalPaginas = Math.max(
		1,
		Math.ceil(totalPlantillas / ITEMS_POR_PAGINA),
	);

	useEffect(() => {
		if (paginaActual > totalPaginas) {
			setPaginaActual(1);
		}
	}, [paginaActual, totalPaginas]);

	const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
	const indiceFin = indiceInicio + ITEMS_POR_PAGINA;

	const plantillasPaginadas = useMemo(() => {
		if (!datos?.plantillas) return [];
		return datos.plantillas.slice(indiceInicio, indiceFin);
	}, [datos?.plantillas, indiceInicio, indiceFin]);
	const vistaCarpeta = resolverVistaCarpetaDrive({
		carpetaId: datos?.carpetaId,
		carpetaNombre: datos?.carpetaNombre,
	});

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
					<p className="mt-1 text-sm text-slate-600">
						Archivos y formatos de investigación (.xlsx) sincronizados en tiempo
						real desde Google Drive.
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
					<Card className="border-dashed border-2 border-slate-300 bg-slate-50/50 py-12 text-center w-full">
						<CardContent className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
							<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
								<FolderGit2 size={28} />
							</div>
							<div className="space-y-1">
								<h3 className="font-bold text-slate-900 text-lg">
									Carpeta de Google Drive no configurada
								</h3>
								<p className="text-xs text-slate-600 leading-relaxed">
									Para consultar las plantillas de seguimiento, debes vincular
									el enlace de la carpeta de Google Drive en la sección de
									configuración del sistema.
								</p>
							</div>
							<Button
								type="button"
								variant="default"
								onClick={() => navigate("/configuracion")}
								className="mt-2 text-xs font-semibold"
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
								estado={vistaCarpeta.estado}
							/>
						)}

						{totalPlantillas === 0 ? (
							<Card className="mt-5 border-dashed border-2 border-slate-200 bg-slate-50/50 py-12 text-center w-full">
								<CardContent className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto">
									<FileSpreadsheet size={28} className="text-primary" />
									<div className="space-y-1">
										<h4 className="font-semibold text-slate-800 text-sm">
											{vistaCarpeta.tituloVacio}
										</h4>
										<p className="text-xs text-slate-500">
											{vistaCarpeta.descripcionVacia}
										</p>
									</div>
								</CardContent>
							</Card>
						) : (
							<>
								<div className="mt-5 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
									{plantillasPaginadas.map((plantilla) => (
										<TarjetaPlantilla
											key={plantilla.id}
											plantilla={plantilla}
										/>
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
