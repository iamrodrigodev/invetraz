import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BotonCerrarSesion } from "@/components/navigation/BotonCerrarSesion.tsx";
import { Logo } from "@/components/navigation/Logo.tsx";
import { SidebarItem } from "@/components/navigation/SidebarItem.tsx";
import type { ModuloId } from "@/components/navigation/types.ts";
import { ELEMENTOS_NAVEGACION } from "@/constants/navigation.ts";
import { useAppStore } from "@/store/useAppStore.ts";
import { cn } from "@/utils/cn.ts";

export { ELEMENTOS_NAVEGACION };

export interface SidebarProps {
	moduloActivo: ModuloId;
	alSeleccionarModulo: (id: ModuloId) => void;
	estaColapsado: boolean;
	alAlternarColapso: () => void;
	permiteColapsoManual?: boolean;
	className?: string;
	alSolicitarCerrarSesion?: () => void;
	alCerrarMenuMovil?: () => void;
}

export function Sidebar({
	moduloActivo,
	alSeleccionarModulo,
	estaColapsado,
	alAlternarColapso,
	permiteColapsoManual = true,
	className,
	alSolicitarCerrarSesion,
	alCerrarMenuMovil,
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
				"relative flex h-full w-full select-none flex-col border-slate-200 border-r bg-white text-slate-600",
				className,
			)}
		>
			{permiteColapsoManual && (
				<button
					type="button"
					onClick={alAlternarColapso}
					aria-label={estaColapsado ? "Expandir barra lateral" : "Colapsar barra lateral"}
					className="absolute top-5 -right-3.5 z-20 hidden h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-slate-50 bg-primary text-white shadow-xs transition-all duration-150 ease-in-out hover:bg-primary-700 active:scale-95 lg:flex"
				>
					{estaColapsado ? (
						<ChevronRight size={15} strokeWidth={2.5} />
					) : (
						<ChevronLeft size={15} strokeWidth={2.5} />
					)}
				</button>
			)}

			<div className="flex h-16 shrink-0 items-center justify-between border-slate-200 border-b px-4">
				<Logo estaColapsado={estaColapsado} />
				{alCerrarMenuMovil && (
					<button
						type="button"
						onClick={alCerrarMenuMovil}
						aria-label="Cerrar menú"
						className="ml-2 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 shadow-2xs transition-all hover:bg-slate-100 hover:text-slate-800 active:scale-95 md:hidden"
					>
						<X className="h-4 w-4" strokeWidth={2.2} />
					</button>
				)}
			</div>

			<nav
				className={cn(
					"flex-1 space-y-1.5 px-3.5 py-5",
					estaColapsado ? "overflow-visible" : "overflow-y-auto overflow-x-hidden",
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

			<div className="border-slate-200/80 border-t px-3.5 py-4">
				<BotonCerrarSesion
					estaColapsado={estaColapsado}
					alHacerClic={alSolicitarCerrarSesion ?? manejarCerrarSesion}
				/>
			</div>
		</aside>
	);
}
