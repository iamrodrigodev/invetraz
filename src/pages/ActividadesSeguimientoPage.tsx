import { ClipboardCheck } from "lucide-react";
import { ModuloEnConstruccion } from "../components/ui/ModuloEnConstruccion";

export function ActividadesSeguimientoPage() {
	return (
		<div className="flex w-full flex-1 flex-col">
			<ModuloEnConstruccion
				titulo="Actividades de seguimiento"
				icono={ClipboardCheck}
			/>
		</div>
	);
}
