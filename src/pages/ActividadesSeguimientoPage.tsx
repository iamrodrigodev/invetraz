import { ClipboardCheck } from "lucide-react";
import { ModuloEnConstruccion } from "../components/ui";

export function ActividadesSeguimientoPage() {
	return (
		<div className="flex h-full w-full flex-1 flex-col">
			<ModuloEnConstruccion
				titulo="Actividades de seguimiento"
				icono={ClipboardCheck}
			/>
		</div>
	);
}

export default ActividadesSeguimientoPage;
