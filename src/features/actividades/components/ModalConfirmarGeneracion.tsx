import {
	BookOpen,
	Calendar,
	Check,
	Clock,
	FileSpreadsheet,
	GraduationCap,
	RefreshCw,
	Tag,
	X,
} from "lucide-react";
import type React from "react";
import { Button, Modal } from "../../../components/ui";
import type { ResumenConfirmacionActividad } from "../types/actividades.types";

export interface ModalConfirmarGeneracionProps {
	abierto: boolean;
	cargando: boolean;
	resumen: ResumenConfirmacionActividad | null;
	alConfirmar: () => void;
	alCerrar: () => void;
}

export const ModalConfirmarGeneracion: React.FC<
	ModalConfirmarGeneracionProps
> = ({ abierto, cargando, resumen, alConfirmar, alCerrar }) => {
	if (!resumen) return null;

	const fechaHoraTexto = resumen.horaVencimiento
		? `${resumen.fechaVencimiento} a las ${resumen.horaVencimiento}`
		: resumen.fechaVencimiento;

	return (
		<Modal
			abierto={abierto}
			alCerrar={() => {
				if (!cargando) alCerrar();
			}}
			titulo="Confirmar generación de actividad de seguimiento"
			className="max-w-lg"
		>
			<div className="space-y-4">
				<p className="text-sm text-slate-600">
					Revise la información antes de generar la actividad de seguimiento.
				</p>

				<div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 divide-y divide-slate-200/60 text-sm">
					<div className="flex items-start gap-3 pb-3">
						<GraduationCap size={18} className="text-primary shrink-0 mt-0.5" />
						<div className="min-w-0 flex-1">
							<span className="block text-xs font-medium text-slate-500">
								Clase
							</span>
							<span className="font-semibold text-slate-900 break-words">
								{resumen.nombreClase}
							</span>
						</div>
					</div>

					<div className="flex items-start gap-3 py-3">
						<BookOpen size={18} className="text-primary shrink-0 mt-0.5" />
						<div className="min-w-0 flex-1">
							<span className="block text-xs font-medium text-slate-500">
								Título
							</span>
							<span className="font-semibold text-slate-900 break-words">
								{resumen.titulo}
							</span>
						</div>
					</div>

					<div className="flex items-start gap-3 py-3">
						<FileSpreadsheet
							size={18}
							className="text-primary shrink-0 mt-0.5"
						/>
						<div className="min-w-0 flex-1">
							<span className="block text-xs font-medium text-slate-500">
								Plantilla de seguimiento
							</span>
							<span className="font-semibold text-slate-900 break-words">
								{resumen.nombrePlantilla}
							</span>
						</div>
					</div>

					<div className="flex items-start gap-3 py-3">
						<Calendar size={18} className="text-primary shrink-0 mt-0.5" />
						<div className="min-w-0 flex-1">
							<span className="block text-xs font-medium text-slate-500">
								Vencimiento
							</span>
							<div className="flex items-center gap-1.5 font-semibold text-slate-900">
								<span>{fechaHoraTexto}</span>
								{resumen.horaVencimiento && (
									<Clock size={14} className="text-slate-500" />
								)}
							</div>
						</div>
					</div>

					{resumen.nombreTema && (
						<div className="flex items-start gap-3 py-3">
							<Tag size={18} className="text-primary shrink-0 mt-0.5" />
							<div className="min-w-0 flex-1">
								<span className="block text-xs font-medium text-slate-500">
									Tema
								</span>
								<span className="font-medium text-slate-800">
									{resumen.nombreTema}
								</span>
							</div>
						</div>
					)}

					{resumen.descripcion && (
						<div className="pt-3">
							<span className="block text-xs font-medium text-slate-500 mb-1">
								Descripción
							</span>
							<p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80 leading-relaxed whitespace-pre-wrap max-h-24 overflow-y-auto">
								{resumen.descripcion}
							</p>
						</div>
					)}
				</div>

				<div className="flex items-center justify-end gap-3 pt-2">
					<Button
						type="button"
						variant="ghost"
						onClick={alCerrar}
						disabled={cargando}
						className="font-medium text-slate-600 hover:text-slate-800"
					>
						<X size={16} className="mr-1.5" />
						Cancelar
					</Button>
					<Button
						type="button"
						variant="default"
						onClick={alConfirmar}
						disabled={cargando}
						className="font-semibold shadow-sm"
					>
						{cargando ? (
							<>
								<RefreshCw size={16} className="mr-2 animate-spin" />
								Generando actividad de seguimiento
							</>
						) : (
							<>
								<Check size={16} className="mr-1.5" />
								Confirmar
							</>
						)}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ModalConfirmarGeneracion;
