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
			{/* Overlay oscuro para pantallas móviles */}
			{menuLateralAbierto && (
				<button
					type="button"
					aria-label="Cerrar menú lateral"
					onClick={() => setMenuLateralAbierto(false)}
					className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden cursor-pointer"
				/>
			)}

			{/* Wrapper del Sidebar responsivo */}
			<div
				className={cn(
					"fixed inset-y-0 left-0 z-30 transform transition-all duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0",
					menuLateralAbierto ? "translate-x-0" : "-translate-x-full",
					estaColapsado ? "lg:w-20" : "lg:w-64",
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

			{/* Contenedor principal con Navbar y contenido */}
			<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
				<TopBar
					moduloActivo={moduloActivo}
					alAbrirMenuMovil={() => setMenuLateralAbierto(true)}
				/>

				<main className="relative flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
					<div className="flex min-h-0 w-full flex-1 flex-col">
						{children}
						<div className="h-12 w-full shrink-0 md:h-16" aria-hidden="true" />
					</div>
				</main>
			</div>
		</div>
	);
}
