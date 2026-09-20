import { useEffect, useState } from "react";
import { REGISTRO_MODULOS } from "./components/navigation/modulosRegistry";
import { type ModuloId, ModuloIdSchema } from "./components/navigation/types";
import { DashboardLayout } from "./layouts";

export default function App() {
	const [moduloActivo, setModuloActivo] = useState<ModuloId>(() => {
		const guardado = localStorage.getItem("moduloActivo");
		return ModuloIdSchema.catch("actividades").parse(guardado);
	});

	useEffect(() => {
		localStorage.setItem("moduloActivo", moduloActivo);
	}, [moduloActivo]);

	const ComponenteActivo =
		REGISTRO_MODULOS[moduloActivo] ?? REGISTRO_MODULOS.actividades;

	return (
		<DashboardLayout
			moduloActivo={moduloActivo}
			alCambiarModulo={setModuloActivo}
		>
			<ComponenteActivo />
		</DashboardLayout>
	);
}
