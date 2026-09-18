import { useState } from "react";
import { Sidebar } from "../components/navigation/Sidebar";
import { TopBar } from "../components/navigation/TopBar";
import type { ModuloId } from "../types/navigation";
import { cn } from "../utils/cn";

export interface DashboardLayoutProps {
	moduloActivo: ModuloId;
	alCambiarModulo: (modulo: ModuloId) => void;
	children: React.ReactNode;
}

export function DashboardLayout({
	moduloActivo,
	alCambiarModulo,
	children,
}: DashboardLayoutProps) {
	const [menuLateralAbierto, setMenuLateralAbierto] = useState(false);
	const [estaColapsado, setEstaColapsado] = useState(false);

	const manejarSeleccion = (id: ModuloId) => {
		alCambiarModulo(id);
		setMenuLateralAbierto(false);
	};

	return (
		<div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-800">
			{menuLateralAbierto && (
				<button
					type="button"
					aria-label="Cerrar menú lateral"
					onClick={() => setMenuLateralAbierto(false)}
					className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden cursor-pointer"
				/>
			)}

			<div
				className={cn(
					"fixed inset-y-0 left-0 z-30 transform transition-all duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0",
					menuLateralAbierto ? "translate-x-0" : "-translate-x-full",
					estaColapsado ? "lg:w-20" : "lg:w-72",
				)}
			>
				<Sidebar
					moduloActivo={moduloActivo}
					alSeleccionarModulo={manejarSeleccion}
					estaColapsado={estaColapsado}
					alAlternarColapso={() => setEstaColapsado(!estaColapsado)}
					className="h-full w-full"
				/>
			</div>

			<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
				<TopBar
					moduloActivo={moduloActivo}
					alAbrirMenuMovil={() => setMenuLateralAbierto(true)}
				/>

				<main className="flex flex-1 flex-col overflow-y-auto p-6">
					<div className="flex h-full min-h-0 w-full flex-1 flex-col">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
