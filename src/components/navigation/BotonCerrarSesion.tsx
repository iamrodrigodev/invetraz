import { LogOut } from "lucide-react";
import { cn } from "../../utils/cn";

export interface BotonCerrarSesionProps {
	estaColapsado?: boolean;
	alHacerClic: () => void;
	className?: string;
}

export function BotonCerrarSesion({
	estaColapsado = false,
	alHacerClic,
	className,
}: BotonCerrarSesionProps) {
	return (
		<div className={cn("group/logout relative flex w-full", className)}>
			<button
				type="button"
				onClick={alHacerClic}
				aria-label="Cerrar Sesión"
				className="flex h-11 w-full items-center rounded-xl font-medium text-[15px] bg-white text-red-600 transition-colors duration-150 ease-in-out hover:bg-red-50 hover:text-red-700 active:bg-red-100/70 active:scale-98 cursor-pointer overflow-hidden"
			>
				<div className="flex h-11 w-11 shrink-0 items-center justify-center">
					<LogOut
						className="h-5 w-5 shrink-0 text-red-500 transition-colors group-hover/logout:text-red-600"
						strokeWidth={2}
					/>
				</div>
				<span
					className={cn(
						"overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out text-left",
						estaColapsado
							? "ml-0 max-w-0 opacity-0"
							: "ml-1.5 max-w-45 opacity-100",
					)}
				>
					Cerrar Sesión
				</span>
			</button>

			{estaColapsado && (
				<div className="pointer-events-none absolute left-full top-1/2 ml-2.5 -translate-y-1/2 z-50 whitespace-nowrap rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md opacity-0 group-hover/logout:opacity-100 transition-opacity duration-150">
					Cerrar Sesión
					<div className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-red-600" />
				</div>
			)}
		</div>
	);
}
