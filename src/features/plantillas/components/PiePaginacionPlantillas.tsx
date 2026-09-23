import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export interface PiePaginacionPlantillasProps {
	indiceInicio: number;
	indiceFin: number;
	totalItems: number;
	paginaActual: number;
	totalPaginas: number;
	onCambiarPagina: (pagina: number) => void;
	className?: string;
}

export const PiePaginacionPlantillas: React.FC<
	PiePaginacionPlantillasProps
> = ({
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
			<p className="text-xs font-medium text-slate-600">
				Mostrando{" "}
				<span className="font-semibold text-slate-900">{indiceInicio + 1}</span>{" "}
				a <span className="font-semibold text-slate-900">{ultimoItem}</span> de{" "}
				<span className="font-semibold text-slate-900">{totalItems}</span>{" "}
				{totalItems === 1 ? "plantilla" : "plantillas"}
			</p>

			{totalPaginas > 1 && (
				<div className="flex items-center gap-1.5 self-center sm:self-auto">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onCambiarPagina(Math.max(1, paginaActual - 1))}
						disabled={paginaActual === 1}
						className="h-8 px-2.5 text-xs font-medium"
					>
						<ChevronLeft size={14} className="mr-1" />
						Anterior
					</Button>

					<div className="flex items-center gap-1">
						{Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
							(num) => (
								<Button
									key={num}
									type="button"
									variant={paginaActual === num ? "default" : "outline"}
									size="sm"
									onClick={() => onCambiarPagina(num)}
									className="h-8 w-8 p-0 text-xs font-medium"
								>
									{num}
								</Button>
							),
						)}
					</div>

					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() =>
							onCambiarPagina(Math.min(totalPaginas, paginaActual + 1))
						}
						disabled={paginaActual === totalPaginas}
						className="h-8 px-2.5 text-xs font-medium"
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
