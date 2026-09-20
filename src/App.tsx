import { useEffect, useState } from "react";
import type { ModuloId } from "./components/navigation/types";
import { DashboardLayout } from "./layouts";
import {
	ActividadesSeguimientoPage,
	PlantillasSeguimientoPage,
	ReportesPage,
} from "./pages";

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
			{moduloActivo === "actividades" && <ActividadesSeguimientoPage />}
			{moduloActivo === "reportes" && <ReportesPage />}
			{moduloActivo === "plantillas" && <PlantillasSeguimientoPage />}
		</DashboardLayout>
	);
}
