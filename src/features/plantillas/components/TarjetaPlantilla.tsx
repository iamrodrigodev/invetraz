import {
	Calendar,
	Download,
	ExternalLink,
	FileSpreadsheet,
} from "lucide-react";
import type React from "react";
import { Badge, Button, Card, CardContent } from "../../../components/ui";
import type { PlantillaXlsx } from "../types/plantillas.types";

export interface TarjetaPlantillaProps {
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
		<Card className="border-slate-200/90 bg-white shadow-xs">
			<CardContent className="space-y-4 p-5">
				<div className="space-y-3">
					<div className="flex items-start justify-between gap-3">
						<div className="flex h-7 w-7 shrink-0 items-center justify-center">
							<FileSpreadsheet
								size={23}
								className="text-primary stroke-[2.2]"
							/>
						</div>
						<Badge
							variant={esGoogleSheet ? "success" : "primary"}
							className="shrink-0 text-[10.5px] font-semibold uppercase tracking-wider"
						>
							{esGoogleSheet ? "Google Sheets" : "XLSX"}
						</Badge>
					</div>

					<h3
						className="line-clamp-2 font-bold text-sm text-slate-900 leading-snug"
						title={plantilla.nombre}
					>
						{plantilla.nombre}
					</h3>
				</div>

				<div className="space-y-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
					<div className="flex items-center justify-between gap-3">
						<span className="text-slate-500">Tamaño</span>
						<span className="truncate text-right font-semibold text-slate-700">
							{formatearTamano(plantilla.tamanoBytes)}
						</span>
					</div>

					<div className="flex items-center justify-between gap-3">
						<span className="inline-flex items-center gap-1.5">
							<Calendar size={13} className="text-slate-400 shrink-0" />
							Modificado
						</span>
						<span className="truncate text-right font-medium text-[11px] text-slate-700">
							{formatearFecha(plantilla.ultimaModificacion)}
						</span>
					</div>

					<div className="flex items-center gap-2 pt-2">
						{plantilla.enlaceWeb ? (
							<Button
								type="button"
								variant="default"
								size="default"
								onClick={() => {
									if (plantilla.enlaceWeb) {
										window.open(
											plantilla.enlaceWeb,
											"_blank",
											"noopener,noreferrer",
										);
									}
								}}
								className="w-full"
							>
								<ExternalLink size={16} className="mr-2" />
								Abrir en Drive
							</Button>
						) : null}

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
									variant="outline"
									size="default"
									className="px-3 text-slate-700 hover:text-primary hover:border-primary-300"
								>
									<Download size={16} />
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
