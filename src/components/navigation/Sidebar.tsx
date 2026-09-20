import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ELEMENTOS_NAVEGACION } from "../../constants/navigation";
import { useAppStore } from "../../store/useAppStore";
import { cn } from "../../utils/cn";
import { BotonCerrarSesion } from "./BotonCerrarSesion";
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
	alSolicitarCerrarSesion?: () => void;
}

export function Sidebar({
	moduloActivo,
	alSeleccionarModulo,
	estaColapsado,
	alAlternarColapso,
	className,
	alSolicitarCerrarSesion,
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
				estaColapsado ? "w-20" : "w-72",
				className,
			)}
		>
			<button
				type="button"
				onClick={alAlternarColapso}
				aria-label={
					estaColapsado ? "Expandir barra lateral" : "Colapsar barra lateral"
				}
				className="absolute -right-3.5 top-5 z-20 hidden h-7 w-7 items-center justify-center rounded-full border-2 border-slate-50 bg-primary text-white shadow-xs transition-all duration-150 ease-in-out hover:bg-primary-700 active:scale-95 lg:flex cursor-pointer"
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
					estaColapsado ? "justify-center px-2" : "px-6",
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
				<BotonCerrarSesion
					estaColapsado={estaColapsado}
					alHacerClic={alSolicitarCerrarSesion ?? manejarCerrarSesion}
				/>
			</div>
		</aside>
	);
}
