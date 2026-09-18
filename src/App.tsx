import { lazy, Suspense, useEffect, useState } from "react";
import { Spinner } from "./components/ui";
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
			<Suspense
				fallback={<Spinner fullContainer mensaje="Cargando módulo..." />}
			>
				{moduloActivo === "actividades" && <ActividadesSeguimientoPage />}
				{moduloActivo === "reportes" && <ReportesPage />}
				{moduloActivo === "plantillas" && <PlantillasSeguimientoPage />}
			</Suspense>
		</DashboardLayout>
	);
}
