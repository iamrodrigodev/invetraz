import { ClipboardCheck, Plus } from "lucide-react";
import { useState } from "react";
import { Button, Card, CardContent } from "../../../components/ui";
import { ModalGenerarActividad } from "../components/ModalGenerarActividad";

export function ActividadesSeguimientoPage() {
	const [modalGenerarAbierto, setModalGenerarAbierto] = useState(false);

	return (
		<div className="flex min-h-full w-full flex-1 flex-col">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
				<div className="min-w-0">
					<h1 className="font-extrabold font-heading text-2xl text-slate-900 tracking-tight sm:text-3xl">
						Actividades de seguimiento
					</h1>
					<p className="mt-1 text-sm text-slate-600">
						Gestión, programación y asignación de actividades y matrices de
						seguimiento de investigación.
					</p>
				</div>

				<div className="flex w-full shrink-0 flex-col-reverse gap-3 sm:w-auto sm:flex-row sm:items-center lg:pt-1">
					<Button
						type="button"
						variant="default"
						size="default"
						onClick={() => setModalGenerarAbierto(true)}
						className="w-full sm:w-auto font-semibold shadow-xs"
					>
						<Plus size={16} className="mr-2" />
						Generar
					</Button>
				</div>
			</div>

			<div className="mt-6 flex flex-1 flex-col">
				<Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 py-16 text-center w-full">
					<CardContent className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
						<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
							<ClipboardCheck size={28} />
						</div>
						<div className="space-y-1">
							<h3 className="font-bold text-slate-900 text-lg">
								No hay actividades de seguimiento registradas
							</h3>
							<p className="text-xs text-slate-600 leading-relaxed">
								Comienza haciendo clic en el botón “Generar” para crear una
								actividad vinculada a Google Classroom con su plantilla de
								seguimiento correspondiente.
							</p>
						</div>
						<Button
							type="button"
							variant="default"
							onClick={() => setModalGenerarAbierto(true)}
							className="mt-2 text-xs font-semibold"
						>
							<Plus size={14} className="mr-1.5" />
							Generar actividad ahora
						</Button>
					</CardContent>
				</Card>
			</div>

			<ModalGenerarActividad
				abierto={modalGenerarAbierto}
				alCerrar={() => setModalGenerarAbierto(false)}
			/>
		</div>
	);
}

export default ActividadesSeguimientoPage;
