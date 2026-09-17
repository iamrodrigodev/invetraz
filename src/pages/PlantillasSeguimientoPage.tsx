import { LayoutTemplate } from "lucide-react";
import { ModuloEnConstruccion } from "../components/ui/ModuloEnConstruccion";

export function PlantillasSeguimientoPage() {
	return (
		<div className="flex h-full w-full flex-1 flex-col">
			<ModuloEnConstruccion
				titulo="Plantillas de seguimiento"
				icono={LayoutTemplate}
			/>
		</div>
	);
}
