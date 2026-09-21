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
		<Card className="flex flex-col justify-between border-slate-200/90 bg-white shadow-xs h-full">
			<CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
				<div className="space-y-3">
					<div className="flex items-center justify-between gap-3">
						<FileSpreadsheet
							size={24}
							className="text-primary stroke-[2.2] shrink-0"
						/>
						<Badge
							variant="primary"
							className="text-[10.5px] font-medium uppercase tracking-wider"
						>
							{esGoogleSheet ? "Google Sheets" : "XLSX"}
						</Badge>
					</div>

					<div>
						<h3
							className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2"
							title={plantilla.nombre}
						>
							{plantilla.nombre}
						</h3>
					</div>
				</div>

				<div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
					<div className="flex items-center justify-between">
						<span>Tamaño</span>
						<span className="font-medium text-slate-700">
							{formatearTamano(plantilla.tamanoBytes)}
						</span>
					</div>

					<div className="flex items-center justify-between gap-2">
						<span className="inline-flex items-center gap-1.5">
							<Calendar size={13} className="text-slate-400 shrink-0" />
							Modificado
						</span>
						<span className="font-medium text-slate-700 text-[11px]">
							{formatearFecha(plantilla.ultimaModificacion)}
						</span>
					</div>

					<div className="flex items-center gap-2 pt-2">
						{plantilla.enlaceWeb ? (
							<Button
								type="button"
								variant="default"
								onClick={() => {
									if (plantilla.enlaceWeb) {
										window.open(
											plantilla.enlaceWeb,
											"_blank",
											"noopener,noreferrer",
										);
									}
								}}
								className="flex-1"
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
