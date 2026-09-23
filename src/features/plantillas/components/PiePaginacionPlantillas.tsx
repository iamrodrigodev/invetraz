import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/Button.tsx";
import { cn } from "@/utils/cn.ts";

export interface PiePaginacionPlantillasProps {
	indiceInicio: number;
	indiceFin: number;
	totalItems: number;
	paginaActual: number;
	totalPaginas: number;
	onCambiarPagina: (pagina: number) => void;
	className?: string;
}

export const PiePaginacionPlantillas: React.FC<PiePaginacionPlantillasProps> = ({
	indiceInicio,
	indiceFin,
	totalItems,
	paginaActual,
	totalPaginas,
	onCambiarPagina,
	className,
}) => {
	const ultimoItem = Math.min(indiceFin, totalItems);

	return (
		<div
			className={cn(
				"flex w-full flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
		>
			<p className="font-medium text-slate-600 text-xs">
				Mostrando <span className="font-semibold text-slate-900">{indiceInicio + 1}</span> a{" "}
				<span className="font-semibold text-slate-900">{ultimoItem}</span> de{" "}
				<span className="font-semibold text-slate-900">{totalItems}</span>{" "}
				{totalItems === 1 ? "plantilla" : "plantillas"}
			</p>

			{totalPaginas > 1 && (
				<div className="flex w-full flex-wrap items-center justify-center gap-1.5 sm:w-auto sm:self-auto">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onCambiarPagina(Math.max(1, paginaActual - 1))}
						disabled={paginaActual === 1}
						className="min-h-10 px-2.5 font-medium text-xs"
					>
						<ChevronLeft size={14} className="mr-1" />
						Anterior
					</Button>

					<div className="flex max-w-full items-center gap-1 overflow-x-auto px-0.5">
						{Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
							<Button
								key={num}
								type="button"
								variant={paginaActual === num ? "default" : "outline"}
								size="sm"
								onClick={() => onCambiarPagina(num)}
								className="h-10 w-10 shrink-0 p-0 font-medium text-xs"
							>
								{num}
							</Button>
						))}
					</div>

					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onCambiarPagina(Math.min(totalPaginas, paginaActual + 1))}
						disabled={paginaActual === totalPaginas}
						className="min-h-10 px-2.5 font-medium text-xs"
					>
						Siguiente
						<ChevronRight size={14} className="ml-1" />
					</Button>
				</div>
			)}
		</div>
	);
};

export default PiePaginacionPlantillas;
