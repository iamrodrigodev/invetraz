import {
	Calendar,
	Download,
	ExternalLink,
	FileSpreadsheet,
} from "lucide-react";
import type React from "react";
import { Badge, Button, Card, CardContent } from "../../../components/ui";
import type { PlantillaXlsx } from "../types/plantillas.types";

interface TarjetaPlantillaProps {
	plantilla: PlantillaXlsx;
}

function formatearTamano(bytes?: number | null): string {
	if (!bytes || bytes <= 0) return "Hoja de cálculo en nube";
	const k = 1024;
	const tamanios = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / k ** i).toFixed(1))} ${tamanios[i]}`;
}

function formatearFecha(fechaIso?: string | null): string {
	if (!fechaIso) return "Sin fecha registrada";
	try {
		const fecha = new Date(fechaIso);
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

export const TarjetaPlantilla: React.FC<TarjetaPlantillaProps> = ({
	plantilla,
}) => {
	const esGoogleSheet =
		plantilla.tipoMime === "application/vnd.google-apps.spreadsheet";

	return (
		<Card className="group relative flex flex-col justify-between border-slate-200/90 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-md">
			<CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
				<div className="space-y-3">
					<div className="flex items-start justify-between gap-3">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/10">
							<FileSpreadsheet size={22} className="stroke-[2.2]" />
						</div>
						<Badge
							variant="success"
							className="text-[11px] font-semibold uppercase tracking-wider"
						>
							{esGoogleSheet ? "Google Sheets" : "XLSX"}
						</Badge>
					</div>

					<div>
						<h3
							className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors"
							title={plantilla.nombre}
						>
							{plantilla.nombre}
						</h3>
					</div>
				</div>

				<div className="space-y-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
					<div className="flex items-center justify-between">
						<span>Tamaño</span>
						<span className="font-medium text-slate-700">
							{formatearTamano(plantilla.tamanoBytes)}
						</span>
					</div>

					<div className="flex items-center justify-between gap-2">
						<span className="inline-flex items-center gap-1">
							<Calendar size={13} className="text-slate-400" />
							Modificado
						</span>
						<span className="font-medium text-slate-700 text-[11px]">
							{formatearFecha(plantilla.ultimaModificacion)}
						</span>
					</div>

					<div className="flex items-center gap-2 pt-2">
						{plantilla.enlaceWeb && (
							<a
								href={plantilla.enlaceWeb}
								target="_blank"
								rel="noreferrer"
								className="flex-1"
							>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="w-full text-xs font-medium text-slate-700 hover:text-emerald-700 hover:border-emerald-300 active:scale-[0.98]"
								>
									<ExternalLink size={13} className="mr-1.5" />
									Abrir en Drive
								</Button>
							</a>
						)}

						{plantilla.enlaceDescarga && (
							<a
								href={plantilla.enlaceDescarga}
								target="_blank"
								rel="noreferrer"
								download
								title="Descargar archivo"
							>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="px-2.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
								>
									<Download size={14} />
								</Button>
							</a>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaPlantilla;
