import { BarChart3 } from "lucide-react";
import { ModuloEnConstruccion } from "../components/ui/ModuloEnConstruccion";

export function ReportesPage() {
	return (
		<div className="flex w-full flex-1 flex-col">
			<ModuloEnConstruccion titulo="Reportes" icono={BarChart3} />
		</div>
	);
}
