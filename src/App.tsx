import { lazy, Suspense, useState } from "react";
import { DashboardLayout } from "./layouts";
import type { ModuloId } from "./types";

const ActividadesSeguimientoPage = lazy(
	() => import("./pages/ActividadesSeguimientoPage"),
);
const ReportesPage = lazy(() => import("./pages/ReportesPage"));
const PlantillasSeguimientoPage = lazy(
	() => import("./pages/PlantillasSeguimientoPage"),
);

export default function App() {
	const [moduloActivo, setModuloActivo] = useState<ModuloId>("actividades");

	return (
		<DashboardLayout
			moduloActivo={moduloActivo}
			alCambiarModulo={setModuloActivo}
		>
			<Suspense
				fallback={
					<div className="flex h-full min-h-[450px] w-full flex-1 items-center justify-center rounded-3xl border border-slate-200/60 bg-white">
						<div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					</div>
				}
			>
				{moduloActivo === "actividades" && <ActividadesSeguimientoPage />}
				{moduloActivo === "reportes" && <ReportesPage />}
				{moduloActivo === "plantillas" && <PlantillasSeguimientoPage />}
			</Suspense>
		</DashboardLayout>
	);
}
