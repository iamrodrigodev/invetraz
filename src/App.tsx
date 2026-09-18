import { useState } from "react";
import { DashboardLayout } from "./layouts";
import {
	ActividadesSeguimientoPage,
	PlantillasSeguimientoPage,
	ReportesPage,
} from "./pages";
import type { ModuloId } from "./types";

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
