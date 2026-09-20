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
		<div
			className={cn(
				"group/logout relative flex w-full justify-center",
				className,
			)}
		>
			<button
				type="button"
				onClick={alHacerClic}
				title="Cerrar Sesión"
				className={cn(
					"flex h-11 items-center font-medium text-[15px] bg-white text-red-600 transition-all duration-200 ease-in-out hover:bg-red-50 hover:text-red-700 active:bg-red-100/70 active:scale-98 cursor-pointer",
					estaColapsado
						? "mx-auto w-11 justify-center rounded-xl"
						: "w-full rounded-lg px-3",
				)}
			>
				<LogOut
					className="h-5 w-5 shrink-0 text-red-500 transition-colors group-hover/logout:text-red-600"
					strokeWidth={2}
				/>
				<span
					className={cn(
						"inline-block overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
						estaColapsado
							? "ml-0 max-w-0 opacity-0"
							: "ml-3 max-w-[180px] opacity-100",
					)}
				>
					Cerrar Sesión
				</span>
			</button>

			{estaColapsado && (
				<div className="pointer-events-none absolute left-full top-1/2 ml-2.5 -translate-y-1/2 z-50 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-md opacity-0 group-hover/logout:opacity-100 transition-opacity duration-150">
					Cerrar Sesión
					<div className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
				</div>
			)}
		</div>
	);
}
