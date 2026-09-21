import {
	AlertCircle,
	ExternalLink,
	FileSpreadsheet,
	FolderGit2,
	FolderOpen,
	RefreshCw,
	Search,
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
	Input,
	Skeleton,
} from "../../../components/ui";
import { obtenerPlantillas } from "../api/plantillas.api";
import { TarjetaPlantilla } from "../components/TarjetaPlantilla";
import type { CarpetaPlantillasRespuesta } from "../types/plantillas.types";

const IDS_ESQUELETO = [
	"esq-1",
	"esq-2",
	"esq-3",
	"esq-4",
	"esq-5",
	"esq-6",
	"esq-7",
	"esq-8",
];

export const PlantillasSeguimientoPage: React.FC = () => {
	const navigate = useNavigate();
	const [datos, setDatos] = useState<CarpetaPlantillasRespuesta | null>(null);
	const [cargando, setCargando] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [busqueda, setBusqueda] = useState<string>("");

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

	const plantillasFiltradas = useMemo(() => {
		if (!datos?.plantillas) return [];
		const termino = busqueda.trim().toLowerCase();
		if (!termino) return datos.plantillas;
		return datos.plantillas.filter((p) =>
			p.nombre.toLowerCase().includes(termino),
		);
	}, [datos?.plantillas, busqueda]);

	return (
		<div className="space-y-6 pb-12">
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
								variant="outline"
								size="sm"
								className="text-xs font-medium text-slate-700 hover:text-emerald-700"
							>
								<ExternalLink size={14} className="mr-1.5" />
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
						className="text-xs font-medium text-slate-700"
						title="Sincronizar plantillas con Google Drive"
					>
						<RefreshCw
							size={14}
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
				<div className="space-y-4">
					<Card className="border-slate-200/80 bg-white p-4">
						<div className="flex items-center justify-between">
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-6 w-24" />
						</div>
					</Card>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{IDS_ESQUELETO.map((id) => (
							<Card
								key={id}
								className="border-slate-200/80 bg-white p-5 space-y-4"
							>
								<div className="flex justify-between items-center">
									<Skeleton className="h-10 w-10 rounded-lg" />
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
						<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-inner">
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
				<div className="space-y-4">
					<Card className="border-slate-200/90 bg-white shadow-xs">
						<CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
									<FolderOpen size={20} />
								</div>
								<div>
									<div className="flex items-center gap-2">
										<span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
											Carpeta vinculada:
										</span>
										<Badge variant="slate" className="font-bold">
											{datos.carpetaNombre || "Carpeta de Google Drive"}
										</Badge>
									</div>
									<p className="text-xs text-slate-500 mt-0.5">
										{datos.plantillas.length}{" "}
										{datos.plantillas.length === 1
											? "plantilla encontrada"
											: "plantillas encontradas"}
									</p>
								</div>
							</div>

							<div className="w-full sm:w-72">
								<div className="relative">
									<Search
										size={15}
										className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
									/>
									<Input
										type="text"
										value={busqueda}
										onChange={(e) => setBusqueda(e.target.value)}
										placeholder="Buscar plantilla..."
										className="pl-9 text-xs h-9"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{plantillasFiltradas.length === 0 ? (
						<Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 py-12 text-center">
							<CardContent className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto">
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
									{busqueda ? (
										<AlertCircle size={24} />
									) : (
										<FileSpreadsheet size={24} />
									)}
								</div>
								<div className="space-y-1">
									<h4 className="font-semibold text-slate-800 text-sm">
										{busqueda
											? "Sin coincidencias"
											: "No hay archivos en la carpeta"}
									</h4>
									<p className="text-xs text-slate-500">
										{busqueda
											? `No encontramos ninguna plantilla con el término "${busqueda}".`
											: "No se encontraron archivos de hojas de cálculo (.xlsx) en la carpeta de Drive vinculada."}
									</p>
								</div>
								{busqueda && (
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setBusqueda("")}
										className="text-xs mt-1"
									>
										Limpiar filtro
									</Button>
								)}
							</CardContent>
						</Card>
					) : (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{plantillasFiltradas.map((plantilla) => (
								<TarjetaPlantilla key={plantilla.id} plantilla={plantilla} />
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default PlantillasSeguimientoPage;
