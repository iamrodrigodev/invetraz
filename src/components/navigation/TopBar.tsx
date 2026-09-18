import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ELEMENTOS_NAVEGACION } from "../../constants/navigation";
import { cn } from "../../utils/cn";
import { Button } from "../ui";
import type { ModuloId } from "./types";

export interface TopBarProps {
	moduloActivo: ModuloId;
	alAbrirMenuMovil?: () => void;
	className?: string;
}

export function TopBar({
	moduloActivo,
	alAbrirMenuMovil,
	className,
}: TopBarProps) {
	const navigate = useNavigate();
	const elementoActual = ELEMENTOS_NAVEGACION.find(
		(item) => item.id === moduloActivo,
	);
	const titulo = elementoActual?.titulo || "Sistema de Investigacin";

	const cerrarSesion = () => {
		localStorage.removeItem("jwt");
		navigate("/login", { replace: true });
	};

	return (
		<header
			className={cn(
				"relative z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8",
				className,
			)}
		>
			<div className="flex items-center gap-3 md:gap-4">
				<button
					type="button"
					onClick={alAbrirMenuMovil}
					aria-label="Abrir menǧ de navegacin"
					className="-ml-2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden cursor-pointer"
				>
					<Menu className="h-5 w-5" />
				</button>

				<h1 className="font-heading text-base font-semibold text-slate-800 md:text-lg">
					{titulo}
				</h1>
			</div>

			<div className="flex items-center gap-3">
				<Button
					variant="ghost"
					size="sm"
					onClick={cerrarSesion}
					className="text-slate-500 hover:text-red-600 hover:bg-red-50"
				>
					<LogOut className="h-4 w-4 mr-2" />
					Cerrar Sesin
				</Button>
			</div>
		</header>
	);
}
