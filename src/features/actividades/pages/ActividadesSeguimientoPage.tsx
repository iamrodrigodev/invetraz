import { ClipboardCheck, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Card, CardContent } from "../../../components/ui";
import { ActividadesSeguimientoSkeleton } from "../../../pages/skeletons/ActividadesSeguimientoSkeleton";
import {
	esConfiguracionListaParaActividades,
	useConfiguracionStore,
} from "../../configuracion/store/useConfiguracionStore";
import { ModalGenerarActividad } from "../components/ModalGenerarActividad";

export function ActividadesSeguimientoPage() {
	const {
		credenciales,
		estadoConexion,
		cargado: configuracionCargada,
		cargarConfiguracion,
	} = useConfiguracionStore();
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

	const configuracionValida = esConfiguracionListaParaActividades(
		credenciales,
		estadoConexion,
	);

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

				<div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0 lg:pt-1">
					<Button
						type="button"
						variant="default"
						size="default"
						disabled={!configuracionValida}
						onClick={() => {
							if (configuracionValida) {
								setModalGenerarAbierto(true);
							}
						}}
						className="w-full sm:w-auto font-semibold shadow-xs"
					>
						<Plus size={16} className="mr-2" />
						Generar
					</Button>
					{!configuracionValida && (
						<p className="text-xs text-red-600 font-medium sm:text-right">
							La configuración no está lista para generar actividades
						</p>
					)}
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
					<div className="flex flex-col items-center gap-1.5 mt-2">
						<Button
							type="button"
							variant="default"
							size="default"
							disabled={!configuracionValida}
							onClick={() => {
								if (configuracionValida) {
									setModalGenerarAbierto(true);
								}
							}}
						>
							<Plus size={16} className="mr-1.5" />
							Generar actividad
						</Button>
						{!configuracionValida && (
							<p className="text-xs text-red-600 font-medium">
								La configuración no está lista para generar actividades
							</p>
						)}
					</div>
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
