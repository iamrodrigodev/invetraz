import { useState } from "react";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ActividadesSeguimientoPage } from "./pages/ActividadesSeguimientoPage";
import { PlantillasSeguimientoPage } from "./pages/PlantillasSeguimientoPage";
import { ReportesPage } from "./pages/ReportesPage";
import type { ModuloId } from "./types/navigation";

export default function App() {
	const [moduloActivo, setModuloActivo] = useState<ModuloId>("actividades");

	return (
		<DashboardLayout
			moduloActivo={moduloActivo}
			alCambiarModulo={setModuloActivo}
		>
			{moduloActivo === "actividades" && <ActividadesSeguimientoPage />}
			{moduloActivo === "reportes" && <ReportesPage />}
			{moduloActivo === "plantillas" && <PlantillasSeguimientoPage />}
		</DashboardLayout>
	);
}
