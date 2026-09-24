import { BookOpen, Calendar, ExternalLink, FileSpreadsheet, FolderKanban } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/Badge.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Card, CardContent } from "@/components/ui/Card.tsx";
import type { TareaClassroomDto } from "@/features/actividades/api/actividades.api.ts";

export type TarjetaActividadSeguimientoProps = {
	actividad: TareaClassroomDto;
};

function formatearFechaLimite(fechaIso?: string | null): string {
	if (!fechaIso) {
		return "Sin fecha límite";
	}
	try {
		const fecha = new Date(fechaIso);
		if (Number.isNaN(fecha.getTime())) {
			return fechaIso;
		}
		return new Intl.DateTimeFormat("es-PE", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(fecha);
	} catch {
		return fechaIso;
	}
}

export const TarjetaActividadSeguimiento: React.FC<TarjetaActividadSeguimientoProps> = ({
	actividad,
}) => {
	const esPublicada = !actividad.estado || actividad.estado === "PUBLISHED";
	const etiquetaEstado = esPublicada ? "Publicada" : "Borrador";
	const enlacePlantilla =
		actividad.enlacePlantilla ||
		(actividad.idPlantilla ? `https://drive.google.com/open?id=${actividad.idPlantilla}` : null);

	return (
		<Card className="border-slate-200/90 bg-white shadow-xs">
			<CardContent className="flex h-full flex-col justify-between space-y-4 px-5 pt-5 pb-5 sm:px-6 sm:pt-6">
				<div className="space-y-3">
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0 space-y-1">
							<h3
								className="line-clamp-2 font-bold text-slate-900 text-sm leading-snug"
								title={actividad.titulo}
							>
								{actividad.titulo}
							</h3>
							{actividad.descripcion && (
								<p className="line-clamp-2 text-slate-500 text-xs" title={actividad.descripcion}>
									{actividad.descripcion}
								</p>
							)}
						</div>
						<Badge
							variant={esPublicada ? "success" : "warning"}
							className="shrink-0 font-semibold text-[10.5px] uppercase tracking-wider"
						>
							{etiquetaEstado}
						</Badge>
					</div>

					<div className="space-y-2.5 border-slate-100 border-t pt-3 text-slate-600 text-xs">
						<div className="flex items-center justify-between gap-3">
							<span className="inline-flex shrink-0 items-center gap-1.5">
								<BookOpen size={13} className="shrink-0 text-slate-400" />
								Clase
							</span>
							<span
								className="truncate text-right font-medium text-slate-800"
								title={actividad.nombreClase || actividad.idClase || "Clase vinculada"}
							>
								{actividad.nombreClase || actividad.idClase || "Clase vinculada"}
							</span>
						</div>

						{actividad.nombreTema && (
							<div className="flex items-center justify-between gap-3">
								<span className="inline-flex shrink-0 items-center gap-1.5">
									<FolderKanban size={13} className="shrink-0 text-slate-400" />
									Tema
								</span>
								<span
									className="truncate text-right font-medium text-slate-800"
									title={actividad.nombreTema}
								>
									{actividad.nombreTema}
								</span>
							</div>
						)}

						<div className="flex items-center justify-between gap-3">
							<span className="inline-flex shrink-0 items-center gap-1.5">
								<FileSpreadsheet size={13} className="shrink-0 text-emerald-600" />
								Plantilla
							</span>
							{enlacePlantilla ? (
								<a
									href={enlacePlantilla}
									target="_blank"
									rel="noreferrer"
									className="truncate text-right font-semibold text-primary hover:underline"
									title={actividad.nombrePlantilla || "Ver plantilla en Drive"}
								>
									{actividad.nombrePlantilla || "Ver plantilla"}
								</a>
							) : (
								<span className="truncate text-right font-medium text-slate-800">
									{actividad.nombrePlantilla || "Plantilla vinculada"}
								</span>
							)}
						</div>

						<div className="flex items-center justify-between gap-3">
							<span className="inline-flex shrink-0 items-center gap-1.5">
								<Calendar size={13} className="shrink-0 text-slate-400" />
								Vencimiento
							</span>
							<span className="truncate text-right font-medium text-[11px] text-slate-800">
								{formatearFechaLimite(actividad.fechaLimite)}
							</span>
						</div>
					</div>
				</div>

				{actividad.enlaceTarea ? (
					<div className="pt-2">
						<Button
							type="button"
							variant="default"
							size="default"
							onClick={() => {
								if (actividad.enlaceTarea) {
									window.open(actividad.enlaceTarea, "_blank", "noopener,noreferrer");
								}
							}}
							className="min-h-11 w-full font-semibold shadow-xs"
						>
							<ExternalLink size={16} className="mr-2" />
							Abrir en Classroom
						</Button>
					</div>
				) : null}
			</CardContent>
		</Card>
	);
};

export default TarjetaActividadSeguimiento;
