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
	plantilla?: PlantillaSeguimientoOpcion | null | undefined;
	validando?: boolean | undefined;
}

export const PrevisualizacionPlantilla: React.FC<
	PrevisualizacionPlantillaProps
> = ({ plantilla, validando = false }) => {
	if (!plantilla) return null;

	if (validando) {
		return (
			<div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-600">
				<RefreshCw size={13} className="animate-spin text-primary" />
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
		<div className="rounded-xl border border-slate-200/80 bg-white p-3 space-y-2.5">
			<div className="flex items-start gap-2.5">
				<FileSpreadsheet
					size={18}
					className="shrink-0 text-emerald-600 mt-0.5"
				/>
				<div className="min-w-0 flex-1 space-y-1">
					<div className="flex flex-wrap items-center gap-1.5">
						<span
							className="text-xs font-semibold text-slate-900 break-words"
							title={plantilla.nombre}
						>
							{plantilla.nombre}
						</span>
						<Badge
							variant="success"
							className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0 shrink-0"
						>
							<CheckCircle2 size={10} />
							Estructura válida
						</Badge>
					</div>
					<div className="text-[11px] text-slate-500">
						Frecuencia de uso:{" "}
						<span className="font-semibold text-slate-700">
							{plantilla.frecuenciaUso}{" "}
							{plantilla.frecuenciaUso === 1 ? "vez" : "veces"}
						</span>
					</div>
				</div>
			</div>

			{plantilla.enlaceWeb && (
				<div className="flex items-center justify-end">
					<a
						href={plantilla.enlaceWeb}
						target="_blank"
						rel="noreferrer"
						className="inline-flex"
					>
						<Button
							type="button"
							variant="default"
							size="sm"
							className="h-8 text-xs font-semibold shadow-xs"
						>
							<ExternalLink size={12} className="mr-1.5" />
							Ver plantilla en Google Sheets
						</Button>
					</a>
				</div>
			)}
		</div>
	);
};

export default PrevisualizacionPlantilla;
