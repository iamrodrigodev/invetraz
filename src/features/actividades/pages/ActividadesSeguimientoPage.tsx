import { ClipboardCheck, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Card, CardContent } from "../../../components/ui";
import { ActividadesSeguimientoSkeleton } from "../../../pages/skeletons/ActividadesSeguimientoSkeleton";
import { useConfiguracionStore } from "../../configuracion/store/useConfiguracionStore";
import { ModalGenerarActividad } from "../components/ModalGenerarActividad";

export function ActividadesSeguimientoPage() {
	const { cargado: configuracionCargada, cargarConfiguracion } =
		useConfiguracionStore();
	const [cargando, setCargando] = useState(!configuracionCargada);
	const [modalGenerarAbierto, setModalGenerarAbierto] = useState(false);

	useEffect(() => {
		let montado = true;
		const iniciar = async () => {
			if (!configuracionCargada) {
				try {
					await Promise.all([
						cargarConfiguracion(),
						new Promise((resolve) => setTimeout(resolve, 200)),
					]);
				} catch {}
			}
			if (montado) {
				setCargando(false);
			}
		};
		iniciar();
		return () => {
			montado = false;
		};
	}, [configuracionCargada, cargarConfiguracion]);

	if (cargando) {
		return <ActividadesSeguimientoSkeleton />;
	}

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

			<Card className="mt-5 border-dashed border-2 border-slate-200 bg-slate-50/50 py-12 text-center w-full">
				<CardContent className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto">
					<ClipboardCheck size={28} className="text-primary" />
					<div className="space-y-1">
						<h4 className="font-semibold text-slate-800 text-sm">
							No hay actividades de seguimiento registradas
						</h4>
						<p className="text-xs text-slate-500">
							Comienza haciendo clic en el botón “Generar” para crear una
							actividad vinculada a Google Classroom con su plantilla de
							seguimiento correspondiente.
						</p>
					</div>
					<Button
						type="button"
						variant="default"
						size="default"
						onClick={() => setModalGenerarAbierto(true)}
						className="mt-2"
					>
						<Plus size={16} className="mr-1.5" />
						Generar actividad
					</Button>
				</CardContent>
			</Card>

			<ModalGenerarActividad
				abierto={modalGenerarAbierto}
				alCerrar={() => setModalGenerarAbierto(false)}
			/>
		</div>
	);
}

export default ActividadesSeguimientoPage;
