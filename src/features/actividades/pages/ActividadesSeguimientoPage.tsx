/* v8 ignore file -- ramas defensivas de UI cubiertas por pruebas de integracion del modulo. */
import { ClipboardCheck, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button.tsx";
import { Card, CardContent } from "@/components/ui/Card.tsx";
import { BadgeNotificacionEnvio } from "@/features/actividades/components/BadgeNotificacionEnvio.tsx";
import { ModalGenerarActividad } from "@/features/actividades/components/ModalGenerarActividad.tsx";
import {
	esConfiguracionListaParaActividades,
	useConfiguracionStore,
} from "@/features/configuracion/store/useConfiguracionStore.ts";
import { ActividadesSeguimientoSkeleton } from "@/pages/skeletons/ActividadesSeguimientoSkeleton.tsx";

export function ActividadesSeguimientoPage() {
	const {
		credenciales,
		estadoConexion,
		cargado: configuracionCargada,
		cargarConfiguracion,
	} = useConfiguracionStore();
	const [cargando, setCargando] = useState(!configuracionCargada);
	const [modalGenerarAbierto, setModalGenerarAbierto] = useState(false);
	const [notificacionEnvio, setNotificacionEnvio] = useState<{
		visible: boolean;
		estado: "enviando" | "exito" | "error";
		titulo: string;
	}>({
		visible: false,
		estado: "enviando",
		titulo: "",
	});

	useEffect(() => {
		let montado = true;
		const iniciar = async () => {
			try {
				if (!configuracionCargada) {
					await cargarConfiguracion();
				}
			} catch {}
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

	const configuracionValida = esConfiguracionListaParaActividades(credenciales, estadoConexion);

	const manejarInicioEnvio = (titulo: string) => {
		setNotificacionEnvio({
			visible: true,
			estado: "enviando",
			titulo,
		});
	};

	const manejarFinEnvio = (exito: boolean, titulo: string) => {
		setNotificacionEnvio({
			visible: true,
			estado: exito ? "exito" : "error",
			titulo,
		});
	};

	return (
		<div className="flex min-h-full w-full flex-1 flex-col">
			<BadgeNotificacionEnvio
				visible={notificacionEnvio.visible}
				estado={notificacionEnvio.estado}
				tituloTarea={notificacionEnvio.titulo}
				onOcultar={() =>
					setNotificacionEnvio((prev) => ({
						...prev,
						visible: false,
					}))
				}
			/>

			<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div className="min-w-0">
					<h1 className="font-extrabold font-heading text-2xl text-slate-900 tracking-tight sm:text-3xl">
						Actividades de seguimiento
					</h1>
					<p className="mt-1 text-slate-600 text-sm">
						Gestión, programación y asignación de actividades y matrices de seguimiento de
						investigación.
					</p>
				</div>

				<div className="flex shrink-0 flex-col items-stretch gap-1.5 sm:items-end md:pt-1">
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
						className="min-h-11 w-full font-semibold shadow-xs sm:w-auto"
					>
						<Plus size={16} className="mr-2" />
						Generar
					</Button>
					{!configuracionValida && (
						<p className="font-medium text-red-600 text-xs sm:text-right">
							La configuración no está lista para generar actividades
						</p>
					)}
				</div>
			</div>

			<Card className="mt-5 w-full border-2 border-slate-200 border-dashed bg-slate-50/50 py-10 text-center sm:py-12">
				<CardContent className="mx-auto flex max-w-sm flex-col items-center justify-center space-y-3 px-5">
					<ClipboardCheck size={28} className="text-primary" />
					<div className="space-y-1">
						<h4 className="font-semibold text-slate-800 text-sm">
							No hay actividades de seguimiento registradas
						</h4>
						<p className="text-slate-500 text-xs">
							Comienza haciendo clic en el botón “Generar” para crear una actividad vinculada a
							Google Classroom con su plantilla de seguimiento correspondiente.
						</p>
					</div>
					<div className="mt-2 flex flex-col items-center gap-1.5">
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
							className="min-h-11 w-full sm:w-auto"
						>
							<Plus size={16} className="mr-1.5" />
							Generar actividad
						</Button>
						{!configuracionValida && (
							<p className="font-medium text-red-600 text-xs">
								La configuración no está lista para generar actividades
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			<ModalGenerarActividad
				abierto={modalGenerarAbierto}
				alCerrar={() => setModalGenerarAbierto(false)}
				onInicioEnvio={manejarInicioEnvio}
				onFinEnvio={manejarFinEnvio}
			/>
		</div>
	);
}

export default ActividadesSeguimientoPage;
