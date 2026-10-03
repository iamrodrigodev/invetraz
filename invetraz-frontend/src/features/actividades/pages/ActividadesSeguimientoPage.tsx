import { ClipboardCheck, Plus, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "@/components/ui/Alert.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Card, CardContent } from "@/components/ui/Card.tsx";
import {
	obtenerActividadesSeguimiento,
	sincronizarActividadesSeguimiento,
	type TareaClassroomDto,
} from "@/features/actividades/api/actividades.api.ts";
import { ModalGenerarActividad } from "@/features/actividades/components/ModalGenerarActividad.tsx";
import { TarjetaActividadSeguimiento } from "@/features/actividades/components/TarjetaActividadSeguimiento.tsx";
import { useClasesDocenteStore } from "@/features/actividades/store/useClasesDocenteStore.ts";
import { usePlantillasSeguimientoStore } from "@/features/actividades/store/usePlantillasSeguimientoStore.ts";
import {
	esConfiguracionListaParaActividades,
	useConfiguracionStore,
} from "@/features/configuracion/store/useConfiguracionStore.ts";
import {
	ActividadesSeguimientoSkeleton,
	TarjetasActividadesSkeleton,
} from "@/pages/skeletons/ActividadesSeguimientoSkeleton.tsx";

export function ActividadesSeguimientoPage() {
	const {
		credenciales,
		estadoConexion,
		cargado: configuracionCargada,
		cargarConfiguracion,
	} = useConfiguracionStore();
	const [cargando, setCargando] = useState(true);
	const [cargandoLista, setCargandoLista] = useState(false);
	const [sincronizando, setSincronizando] = useState(false);
	const [actividades, setActividades] = useState<TareaClassroomDto[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [modalGenerarAbierto, setModalGenerarAbierto] = useState(false);

	const cargarActividades = useCallback(async (mostrarSkeleton = true) => {
		if (mostrarSkeleton) {
			setCargandoLista(true);
		}
		setError(null);
		try {
			const lista = await obtenerActividadesSeguimiento();
			setActividades(lista);
		} catch {
		} finally {
			if (mostrarSkeleton) {
				setCargandoLista(false);
			}
		}
	}, []);

	const manejarSincronizar = useCallback(async () => {
		setSincronizando(true);
		setCargandoLista(true);
		setError(null);
		try {
			const lista = await sincronizarActividadesSeguimiento();
			setActividades(lista);
			usePlantillasSeguimientoStore
				.getState()
				.cargarPlantillas(true)
				.catch(() => {});
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "No se pudieron sincronizar las actividades con Google Classroom",
			);
		} finally {
			setSincronizando(false);
			setCargandoLista(false);
		}
	}, []);

	const manejarActividadGenerada = useCallback(async () => {
		setCargandoLista(true);
		try {
			const [lista] = await Promise.all([
				obtenerActividadesSeguimiento().catch(() => []),
				usePlantillasSeguimientoStore
					.getState()
					.cargarPlantillas(true)
					.catch(() => []),
			]);
			setActividades(lista);
		} finally {
			setCargandoLista(false);
		}
	}, []);

	useEffect(() => {
		let montado = true;
		const iniciar = async () => {
			try {
				await Promise.all([
					configuracionCargada ? Promise.resolve() : cargarConfiguracion().catch(() => {}),
					obtenerActividadesSeguimiento()
						.then((lista) => {
							if (montado) {
								setActividades(lista);
							}
						})
						.catch(() => {}),
				]);
			} finally {
				if (montado) {
					setCargando(false);
				}
			}
		};
		iniciar();
		return () => {
			montado = false;
		};
	}, [configuracionCargada, cargarConfiguracion]);

	useEffect(() => {
		usePlantillasSeguimientoStore
			.getState()
			.cargarPlantillas()
			.catch(() => {});
		useClasesDocenteStore
			.getState()
			.cargarClases()
			.catch(() => {});
	}, []);

	if (cargando) {
		return <ActividadesSeguimientoSkeleton />;
	}

	const configuracionValida = esConfiguracionListaParaActividades(credenciales, estadoConexion);

	return (
		<div className="flex min-h-full w-full flex-1 flex-col">
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
					<div className="flex w-full flex-col-reverse gap-2.5 sm:w-auto sm:flex-row sm:items-center">
						<Button
							type="button"
							variant="outline"
							size="default"
							disabled={!configuracionValida || sincronizando}
							onClick={manejarSincronizar}
							className="min-h-11 w-full sm:w-auto"
							title="Sincronizar actividades con Google Classroom"
						>
							<RefreshCw
								size={16}
								className={`mr-2 ${sincronizando ? "animate-spin text-primary" : ""}`}
							/>
							{sincronizando ? "Sincronizando..." : "Sincronizar"}
						</Button>

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
					</div>
					{!configuracionValida && (
						<p className="font-medium text-red-600 text-xs sm:text-right">
							La configuración no está lista para generar actividades
						</p>
					)}
				</div>
			</div>

			{error && (
				<div className="mt-5">
					<Alert
						key="alerta-error-actividades"
						variant="error"
						message={error}
						onClose={() => setError(null)}
					/>
				</div>
			)}

			{cargandoLista || sincronizando ? (
				<div className="mt-6">
					<TarjetasActividadesSkeleton />
				</div>
			) : actividades.length === 0 ? (
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
			) : (
				<div
					data-testid="lista-actividades-seguimiento"
					className="mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
				>
					{actividades.map((actividad) => (
						<TarjetaActividadSeguimiento key={actividad.idTarea} actividad={actividad} />
					))}
				</div>
			)}

			<ModalGenerarActividad
				abierto={modalGenerarAbierto}
				alCerrar={() => setModalGenerarAbierto(false)}
				onActividadGenerada={() => {
					manejarActividadGenerada().catch(() => {
						cargarActividades(false);
					});
				}}
			/>
		</div>
	);
}

export default ActividadesSeguimientoPage;
