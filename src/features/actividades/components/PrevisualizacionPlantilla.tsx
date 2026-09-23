import { CheckCircle2, ExternalLink, FileSpreadsheet, RefreshCw, X } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/Badge.tsx";
import { Button } from "@/components/ui/Button.tsx";
import type { PlantillaSeguimientoOpcion } from "@/features/actividades/types/actividades.types.ts";

export interface PrevisualizacionPlantillaProps {
	plantilla?: PlantillaSeguimientoOpcion | null | undefined;
	validando?: boolean | undefined;
}

export const PrevisualizacionPlantilla: React.FC<PrevisualizacionPlantillaProps> = ({
	plantilla,
	validando = false,
}) => {
	if (!plantilla) {
		return null;
	}

	if (validando) {
		return (
			<div className="animate-fadeIn py-1">
				<Badge
					variant="primary"
					className="inline-flex items-center gap-1.5 px-3 py-1 font-semibold text-xs"
				>
					<RefreshCw size={13} className="shrink-0 animate-spin text-primary" />
					<span>Verificando estructura de la plantilla</span>
				</Badge>
			</div>
		);
	}

	if (!plantilla.estructuraValida) {
		const errores = plantilla.erroresEstructura ?? [];

		return (
			<div
				role="alert"
				className="animate-fadeIn space-y-2.5 rounded-xl border border-red-200 bg-red-50/60 p-3"
			>
				<div className="flex items-start gap-2.5">
					<FileSpreadsheet size={18} className="mt-0.5 shrink-0 text-red-600" />
					<div className="min-w-0 flex-1 space-y-1.5">
						<div className="flex flex-wrap items-center gap-1.5">
							<span
								className="wrap-break-word font-semibold text-red-950 text-xs"
								title={plantilla.nombre}
							>
								{plantilla.nombre}
							</span>
							<Badge
								variant="destructive"
								className="inline-flex shrink-0 items-center gap-1 px-1.5 py-0 font-medium text-[10px]"
							>
								<X size={11} strokeWidth={2.5} className="shrink-0" />
								Estructura inválida
							</Badge>
						</div>
						<p className="text-red-800 text-xs">
							{plantilla.mensajeErrorEstructura ||
								"La plantilla seleccionada no cumple con la estructura requerida para la actividad de seguimiento."}
						</p>
						{errores.length > 0 && (
							<ul className="list-disc space-y-1 pl-4 text-[11px] text-red-700">
								{errores.map((error) => (
									<li key={error}>{error}</li>
								))}
							</ul>
						)}
					</div>
				</div>

				{plantilla.enlaceWeb && (
					<div className="flex items-center justify-end">
						<a href={plantilla.enlaceWeb} target="_blank" rel="noreferrer" className="inline-flex">
							<Button
								type="button"
								variant="default"
								size="sm"
								className="h-8 font-semibold text-xs shadow-xs"
							>
								<ExternalLink size={12} className="mr-1.5" />
								Abrir plantilla
							</Button>
						</a>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="animate-fadeIn space-y-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
			<div className="flex items-start gap-2.5">
				<FileSpreadsheet size={18} className="mt-0.5 shrink-0 text-emerald-600" />
				<div className="min-w-0 flex-1 space-y-1">
					<div className="flex flex-wrap items-center gap-1.5">
						<span
							className="wrap-break-word font-semibold text-emerald-950 text-xs"
							title={plantilla.nombre}
						>
							{plantilla.nombre}
						</span>
						<Badge
							variant="success"
							className="inline-flex shrink-0 items-center gap-1 px-1.5 py-0 text-[10px]"
						>
							<CheckCircle2 size={10} />
							Estructura válida
						</Badge>
					</div>
					<div className="text-[11px] text-emerald-700">
						Frecuencia de uso:{" "}
						<span className="font-semibold text-emerald-800">
							{plantilla.frecuenciaUso} {plantilla.frecuenciaUso === 1 ? "vez" : "veces"}
						</span>
					</div>
				</div>
			</div>

			{plantilla.enlaceWeb && (
				<div className="flex items-center justify-end">
					<a href={plantilla.enlaceWeb} target="_blank" rel="noreferrer" className="inline-flex">
						<Button
							type="button"
							variant="default"
							size="sm"
							className="h-8 font-semibold text-xs shadow-xs"
						>
							<ExternalLink size={12} className="mr-1.5" />
							Abrir plantilla
						</Button>
					</a>
				</div>
			)}
		</div>
	);
};

export default PrevisualizacionPlantilla;
