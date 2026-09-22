import {
	CheckCircle2,
	ExternalLink,
	FileSpreadsheet,
	RefreshCw,
} from "lucide-react";
import type React from "react";
import { Alert, Badge, Button } from "../../../components/ui";
import type { PlantillaSeguimientoOpcion } from "../types/actividades.types";

export interface PrevisualizacionPlantillaProps {
	plantilla?: PlantillaSeguimientoOpcion | null;
	validando?: boolean;
}

export const PrevisualizacionPlantilla: React.FC<
	PrevisualizacionPlantillaProps
> = ({ plantilla, validando = false }) => {
	if (!plantilla) return null;

	if (validando) {
		return (
			<div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs text-slate-600">
				<RefreshCw size={14} className="animate-spin text-primary" />
				<span>Validando estructura de la plantilla...</span>
			</div>
		);
	}

	if (!plantilla.estructuraValida) {
		return (
			<Alert
				variant="error"
				message={
					plantilla.mensajeErrorEstructura ||
					"La plantilla seleccionada no cumple con la estructura requerida para la actividad de seguimiento."
				}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3.5 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex min-w-0 items-center gap-3">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-700">
					<FileSpreadsheet size={20} />
				</div>
				<div className="min-w-0 space-y-1">
					<div className="flex flex-wrap items-center gap-2">
						<span className="truncate text-sm font-semibold text-slate-900">
							{plantilla.nombre}
						</span>
						<Badge
							variant="success"
							className="inline-flex items-center gap-1 text-[11px]"
						>
							<CheckCircle2 size={12} />
							Estructura válida
						</Badge>
					</div>
					<div className="text-xs text-slate-600">
						Frecuencia de uso:{" "}
						<span className="font-semibold text-slate-800">
							{plantilla.frecuenciaUso}{" "}
							{plantilla.frecuenciaUso === 1 ? "vez" : "veces"}
						</span>
					</div>
				</div>
			</div>

			{plantilla.enlaceWeb && (
				<a
					href={plantilla.enlaceWeb}
					target="_blank"
					rel="noreferrer"
					className="shrink-0 self-start sm:self-auto"
				>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="h-8 border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 shadow-none text-xs font-semibold"
					>
						<ExternalLink size={13} className="mr-1.5" />
						Ver plantilla en Google Sheets
					</Button>
				</a>
			)}
		</div>
	);
};

export default PrevisualizacionPlantilla;
