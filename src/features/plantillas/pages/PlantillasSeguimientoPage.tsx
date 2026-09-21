import {
	ChevronLeft,
	ChevronRight,
	ExternalLink,
	FileSpreadsheet,
	FolderCheck,
	FolderGit2,
	RefreshCw,
	Settings,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Alert,
	Badge,
	Button,
	Card,
	CardContent,
	Skeleton,
} from "../../../components/ui";
import { obtenerPlantillas } from "../api/plantillas.api";
import { TarjetaPlantilla } from "../components/TarjetaPlantilla";
import type { CarpetaPlantillasRespuesta } from "../types/plantillas.types";

const ITEMS_POR_PAGINA = 9;

const IDS_ESQUELETO = [
	"esq-1",
	"esq-2",
	"esq-3",
	"esq-4",
	"esq-5",
	"esq-6",
	"esq-7",
	"esq-8",
	"esq-9",
];

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

	return (
		<div className="space-y-6 pb-12 w-full">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="font-extrabold font-heading text-2xl text-slate-900 tracking-tight sm:text-3xl">
						Plantillas de Seguimiento
					</h1>
					<p className="mt-1 text-sm text-slate-600">
						Archivos y formatos de investigación (.xlsx) sincronizados en tiempo
						real desde Google Drive.
					</p>
				</div>

				<div className="flex items-center gap-2">
					{datos?.carpetaConfigurada && datos.carpetaId && (
						<a
							href={`https://drive.google.com/drive/folders/${datos.carpetaId}`}
							target="_blank"
							rel="noreferrer"
						>
							<Button
								type="button"
								variant="default"
								size="sm"
								className="h-9 px-3 text-xs font-medium shadow-xs"
							>
								<ExternalLink size={13} className="mr-1.5" />
								Abrir carpeta en Drive
							</Button>
						</a>
					)}
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={cargar}
						disabled={cargando}
						className="h-9 text-xs font-medium text-slate-700"
						title="Sincronizar plantillas con Google Drive"
					>
						<RefreshCw
							size={13}
							className={`mr-1.5 ${cargando ? "animate-spin text-primary" : ""}`}
						/>
						{cargando ? "Sincronizando..." : "Sincronizar"}
					</Button>
				</div>
			</div>

			{error && (
				<Alert
					key="alerta-error"
					variant="error"
					message={error}
					onClose={() => setError(null)}
				/>
			)}

			{cargando && (
				<div className="space-y-6">
					<Card className="border-slate-200/80 bg-white p-4">
						<div className="flex items-center justify-between">
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-6 w-24" />
						</div>
					</Card>
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{IDS_ESQUELETO.map((id) => (
							<Card
								key={id}
								className="border-slate-200/80 bg-white p-5 space-y-4"
							>
								<div className="flex justify-between items-center">
									<Skeleton className="h-8 w-8 rounded-md" />
									<Skeleton className="h-5 w-16" />
								</div>
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-8 w-full rounded-md" />
							</Card>
						))}
					</div>
				</div>
			)}

			{!cargando && !datos?.carpetaConfigurada && (
				<Card className="border-dashed border-2 border-slate-300 bg-slate-50/50 py-12 text-center">
					<CardContent className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
						<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
							<FolderGit2 size={28} />
						</div>
						<div className="space-y-1">
							<h3 className="font-bold text-slate-900 text-lg">
								Carpeta de Google Drive no configurada
							</h3>
							<p className="text-xs text-slate-600 leading-relaxed">
								Para consultar las plantillas de seguimiento, debes vincular el
								enlace de la carpeta de Google Drive en la sección de
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

			{!cargando && datos?.carpetaConfigurada && (
				<div className="space-y-6">
					<Card className="border-slate-200/90 bg-white shadow-xs">
						<CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
							<div className="flex items-center gap-3">
								<FolderCheck
									size={24}
									className="text-primary stroke-[2.2] shrink-0"
								/>
								<div>
									<div className="flex items-center gap-2 flex-wrap">
										<span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
											Carpeta vinculada:
										</span>
										<Badge variant="primary" className="font-medium text-xs">
											{datos.carpetaNombre || "Carpeta de Google Drive"}
										</Badge>
									</div>
									<p className="text-xs text-slate-600 mt-1">
										{totalPlantillas}{" "}
										{totalPlantillas === 1
											? "plantilla disponible"
											: "plantillas disponibles"}{" "}
										en Google Drive
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{totalPlantillas === 0 ? (
						<Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 py-12 text-center">
							<CardContent className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto">
								<FileSpreadsheet size={28} className="text-primary" />
								<div className="space-y-1">
									<h4 className="font-semibold text-slate-800 text-sm">
										No hay archivos en la carpeta
									</h4>
									<p className="text-xs text-slate-500">
										No se encontraron archivos de hojas de cálculo (.xlsx) en la
										carpeta de Drive vinculada.
									</p>
								</div>
							</CardContent>
						</Card>
					) : (
						<>
							<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
								{plantillasPaginadas.map((plantilla) => (
									<TarjetaPlantilla key={plantilla.id} plantilla={plantilla} />
								))}
							</div>

							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-200/80">
								<p className="text-xs text-slate-600">
									Mostrando{" "}
									<span className="font-semibold text-slate-900">
										{indiceInicio + 1}
									</span>{" "}
									a{" "}
									<span className="font-semibold text-slate-900">
										{Math.min(indiceFin, totalPlantillas)}
									</span>{" "}
									de{" "}
									<span className="font-semibold text-slate-900">
										{totalPlantillas}
									</span>{" "}
									{totalPlantillas === 1 ? "plantilla" : "plantillas"}
								</p>

								{totalPaginas > 1 && (
									<div className="flex items-center gap-1.5 self-center sm:self-auto">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												setPaginaActual((prev) => Math.max(1, prev - 1))
											}
											disabled={paginaActual === 1}
											className="h-8 px-2.5 text-xs font-medium"
										>
											<ChevronLeft size={14} className="mr-1" />
											Anterior
										</Button>

										<div className="flex items-center gap-1">
											{Array.from(
												{ length: totalPaginas },
												(_, i) => i + 1,
											).map((num) => (
												<Button
													key={num}
													type="button"
													variant={paginaActual === num ? "default" : "outline"}
													size="sm"
													onClick={() => setPaginaActual(num)}
													className="h-8 w-8 p-0 text-xs font-medium"
												>
													{num}
												</Button>
											))}
										</div>

										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												setPaginaActual((prev) =>
													Math.min(totalPaginas, prev + 1),
												)
											}
											disabled={paginaActual === totalPaginas}
											className="h-8 px-2.5 text-xs font-medium"
										>
											Siguiente
											<ChevronRight size={14} className="ml-1" />
										</Button>
									</div>
								)}
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default PlantillasSeguimientoPage;
