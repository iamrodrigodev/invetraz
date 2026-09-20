import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ELEMENTOS_NAVEGACION } from "../../constants/navigation";
import { useAppStore } from "../../store/useAppStore";
import { cn } from "../../utils/cn";
import { Logo } from "./Logo";
import { SidebarItem } from "./SidebarItem";
import type { ModuloId } from "./types";

export { ELEMENTOS_NAVEGACION };

export interface SidebarProps {
	moduloActivo: ModuloId;
	alSeleccionarModulo: (id: ModuloId) => void;
	estaColapsado: boolean;
	alAlternarColapso: () => void;
	className?: string;
}

export function Sidebar({
	moduloActivo,
	alSeleccionarModulo,
	estaColapsado,
	alAlternarColapso,
	className,
}: SidebarProps) {
	const navigate = useNavigate();
	const cerrarSesionStore = useAppStore((state) => state.cerrarSesion);

	const manejarCerrarSesion = async () => {
		await cerrarSesionStore();
		navigate("/login", { replace: true });
	};

	return (
		<aside
			className={cn(
				"relative flex h-full flex-col border-r border-slate-200 bg-white text-slate-600 transition-all duration-300 ease-in-out select-none",
				estaColapsado ? "w-20" : "w-64",
				className,
			)}
		>
			<button
				type="button"
				onClick={alAlternarColapso}
				aria-label={
					estaColapsado ? "Expandir barra lateral" : "Colapsar barra lateral"
				}
				className="absolute -right-3.5 top-5 z-20 hidden h-7 w-7 items-center justify-center rounded-full border-2 border-slate-50 bg-primary text-white shadow-xs transition-transform hover:bg-primary-700 active:scale-95 lg:flex cursor-pointer"
			>
				{estaColapsado ? (
					<ChevronRight size={15} strokeWidth={2.5} />
				) : (
					<ChevronLeft size={15} strokeWidth={2.5} />
				)}
			</button>

			<div
				className={cn(
					"flex h-16 shrink-0 items-center border-b border-slate-200",
					estaColapsado ? "justify-center px-2" : "px-5",
				)}
			>
				<Logo estaColapsado={estaColapsado} />
			</div>

			<nav
				className={cn(
					"flex-1 space-y-1.5 overflow-x-hidden overflow-y-auto py-5",
					estaColapsado ? "px-2" : "px-3",
				)}
			>
				{ELEMENTOS_NAVEGACION.map((item) => (
					<SidebarItem
						key={item.id}
						item={item}
						esActivo={moduloActivo === item.id}
						estaColapsado={estaColapsado}
						alHacerClic={() => alSeleccionarModulo(item.id)}
					/>
				))}
			</nav>

			<div
				className={cn(
					"border-t border-slate-200/80 py-4",
					estaColapsado ? "px-2" : "px-3",
				)}
			>
				<div className="group/logout relative flex w-full justify-center">
					<button
						type="button"
						onClick={manejarCerrarSesion}
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
			</div>
		</aside>
	);
}
