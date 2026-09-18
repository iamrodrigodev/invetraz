import { lazy, Suspense, useEffect, useState } from "react";
import type { ModuloId } from "./components/navigation/types";
import { PageSkeleton } from "./components/ui";
import { DashboardLayout } from "./layouts";

const ActividadesSeguimientoPage = lazy(
	() => import("./pages/ActividadesSeguimientoPage"),
);
const ReportesPage = lazy(() => import("./pages/ReportesPage"));
const PlantillasSeguimientoPage = lazy(
	() => import("./pages/PlantillasSeguimientoPage"),
);

export default function App() {
	const [moduloActivo, setModuloActivo] = useState<ModuloId>(() => {
		const guardado = localStorage.getItem("moduloActivo");
		return (guardado as ModuloId) || "actividades";
	});

	useEffect(() => {
		localStorage.setItem("moduloActivo", moduloActivo);
	}, [moduloActivo]);

	return (
		<DashboardLayout
			moduloActivo={moduloActivo}
			alCambiarModulo={setModuloActivo}
		>
			<Suspense fallback={<PageSkeleton />}>
				{moduloActivo === "actividades" && <ActividadesSeguimientoPage />}
				{moduloActivo === "reportes" && <ReportesPage />}
				{moduloActivo === "plantillas" && <PlantillasSeguimientoPage />}
			</Suspense>
		</DashboardLayout>
	);
}
