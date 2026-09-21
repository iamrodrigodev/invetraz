import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { REGISTRO_MODULOS } from "./components/navigation/modulosRegistry";
import { type ModuloId, ModuloIdSchema } from "./components/navigation/types";
import { DashboardLayout } from "./layouts";

export default function App() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const ruta = pathname.slice(1);
	const moduloActivo = ModuloIdSchema.catch("actividades").parse(ruta);

	useEffect(() => {
		if (pathname === "/") {
			const guardado = ModuloIdSchema.catch("actividades").parse(
				localStorage.getItem("moduloActivo"),
			);
			navigate(`/${guardado}`, { replace: true });
		} else if (ruta !== moduloActivo) {
			navigate(`/${moduloActivo}`, { replace: true });
		} else {
			localStorage.setItem("moduloActivo", moduloActivo);
		}
	}, [moduloActivo, navigate, pathname, ruta]);

	const ComponenteActivo = REGISTRO_MODULOS[moduloActivo];

	return (
		<DashboardLayout
			moduloActivo={moduloActivo}
			alCambiarModulo={(id: ModuloId) => navigate(`/${id}`)}
		>
			<ComponenteActivo />
		</DashboardLayout>
	);
}
