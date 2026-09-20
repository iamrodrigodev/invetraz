import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Key, RefreshCw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from "../../../components/ui";
import { VALIDATION_LIMITS } from "../../../constants/validations";
import {
	actualizarConfiguracion,
	obtenerConfiguracion,
	verificarConfiguracion,
} from "../api/configuracion.api";
import {
	CampoCredencial,
	EstadoConexionBadge,
	TarjetaGuiaGoogle,
	type TipoEstadoConexion,
} from "../components";
import {
	type ActualizarCredencialesPeticion,
	ActualizarCredencialesPeticionSchema,
} from "../types/ActualizarCredencialesPeticion";

export function ConfiguracionPage() {
	const [cargandoInicial, setCargandoInicial] = useState(true);
	const [estadoConexion, setEstadoConexion] =
		useState<TipoEstadoConexion>("no_configurado");
	const [mensajeExito, setMensajeExito] = useState<string | null>(null);
	const [mensajeError, setMensajeError] = useState<string | null>(null);
	const [verificando, setVerificando] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		getValues,
		trigger,
		formState: { errors, isSubmitting },
	} = useForm<ActualizarCredencialesPeticion>({
		resolver: zodResolver(ActualizarCredencialesPeticionSchema),
		mode: "onChange",
		defaultValues: {
			googleClientId: "",
			googleClientSecret: "",
			googleRefreshToken: "",
		},
	});

	useEffect(() => {
		async function cargar() {
			try {
				setCargandoInicial(true);
				const config = await obtenerConfiguracion();
				reset({
					googleClientId: config.googleClientId || "",
					googleClientSecret: config.googleClientSecret || "",
					googleRefreshToken: config.googleRefreshToken || "",
				});

				if (
					config.googleClientId &&
					config.googleClientSecret &&
					config.googleRefreshToken
				) {
					setEstadoConexion("conectado");
				} else {
					setEstadoConexion("no_configurado");
				}
			} catch (error) {
				setMensajeError(
					error instanceof Error
						? error.message
						: "Error al cargar la configuración",
				);
			} finally {
				setCargandoInicial(false);
			}
		}

		cargar();
	}, [reset]);

	const onGuardar = async (data: ActualizarCredencialesPeticion) => {
		try {
			setMensajeError(null);
			setMensajeExito(null);
			await actualizarConfiguracion(data);
			setMensajeExito(
				"Credenciales de Google actualizadas y guardadas exitosamente.",
			);
			reset(data);
		} catch (error) {
			setMensajeError(
				error instanceof Error
					? error.message
					: "Error al guardar la configuración",
			);
		}
	};

	const onProbarConexion = async () => {
		try {
			setMensajeError(null);
			setMensajeExito(null);

			const esValido = await trigger();
			if (!esValido) {
				setMensajeError(
					"Por favor, completa todos los campos requeridos antes de verificar.",
				);
				return;
			}

			setVerificando(true);
			setEstadoConexion("verificando");

			const valores = getValues();
			const res = await verificarConfiguracion(valores);

			setEstadoConexion("conectado");
			setMensajeExito(res.mensaje || "¡Conexión verificada exitosamente!");
		} catch (error) {
			setEstadoConexion("error");
			setMensajeError(
				error instanceof Error
					? error.message
					: "Error al verificar la conexión con Google Classroom",
			);
		} finally {
			setVerificando(false);
		}
	};

	if (cargandoInicial) {
		return (
			<div className="space-y-6 p-4 sm:p-6 lg:p-8">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<Skeleton className="h-8 w-64" />
						<Skeleton className="mt-2 h-4 w-96" />
					</div>
					<Skeleton className="h-6 w-36" />
				</div>
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<div className="space-y-4 lg:col-span-2">
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-48" />
								<Skeleton className="h-4 w-72" />
							</CardHeader>
							<CardContent className="space-y-5">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
							</CardContent>
						</Card>
					</div>
					<div>
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-36" />
							</CardHeader>
							<CardContent className="space-y-3">
								<Skeleton className="h-24 w-full" />
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 p-4 sm:p-6 lg:p-8">
			{/* Encabezado */}
			<div>
				<h1 className="font-extrabold font-heading text-2xl text-slate-900 tracking-tight sm:text-3xl">
					Configuración de Google Classroom
				</h1>
				<p className="mt-1 text-sm text-slate-500">
					Administra las credenciales de la API de Google para la sincronización de clases y tareas.
				</p>
			</div>

			{/* Mensajes de retroalimentación */}
			{mensajeExito && (
				<Alert
					variant="success"
					message={mensajeExito}
					onClose={() => setMensajeExito(null)}
				/>
			)}

			{mensajeError && (
				<Alert
					variant="error"
					message={mensajeError}
					onClose={() => setMensajeError(null)}
				/>
			)}

			{/* Contenedor principal en 2 columnas */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Columna izquierda: Formulario de credenciales */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex items-center gap-2 text-primary font-semibold">
									<Key size={18} />
									<span>Credenciales OAuth 2.0</span>
								</div>
								<EstadoConexionBadge estado={estadoConexion} />
							</div>
							<CardTitle className="text-lg text-slate-900 font-bold">
								Credenciales de API de Google
							</CardTitle>
							<CardDescription>
								Ingresa el Client ID, Client Secret y Refresh Token generados en{" "}
								<a
									href="https://console.cloud.google.com"
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
								>
									Google Cloud Console <ExternalLink size={12} />
								</a>.
							</CardDescription>
						</CardHeader>

						<CardContent>
							<form onSubmit={handleSubmit(onGuardar)} className="space-y-5">
								<CampoCredencial
									id="googleClientId"
									label="Google Client ID"
									descripcion={
										<span>
											Identificador de cliente OAuth 2.0 generado en{" "}
											<a
												href="https://console.cloud.google.com"
												target="_blank"
												rel="noreferrer"
												className="font-medium text-primary hover:underline inline-flex items-center gap-0.5"
											>
												Google Cloud Console <ExternalLink size={11} />
											</a>
										</span>
									}
									placeholder="ej. 1234567890-abcdefg.apps.googleusercontent.com"
									maxLength={VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_ID}
									errorMessage={errors.googleClientId?.message}
									{...register("googleClientId")}
								/>

								<CampoCredencial
									id="googleClientSecret"
									label="Google Client Secret"
									descripcion="Clave secreta del cliente OAuth 2.0"
									placeholder="ej. GOCSPX-abcdefghijklmnop12345"
									esSensible
									maxLength={VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_SECRET}
									errorMessage={errors.googleClientSecret?.message}
									{...register("googleClientSecret")}
								/>

								<CampoCredencial
									id="googleRefreshToken"
									label="Google Refresh Token"
									descripcion={
										<span>
											Token de actualización permanente generado en{" "}
											<a
												href="https://developers.google.com/oauthplayground"
												target="_blank"
												rel="noreferrer"
												className="font-medium text-primary hover:underline inline-flex items-center gap-0.5"
											>
												OAuth 2.0 Playground <ExternalLink size={11} />
											</a>
										</span>
									}
									placeholder="ej. 1//04abcdefghijklmnopqrstuvwxyz"
									esSensible
									maxLength={VALIDATION_LIMITS.MAX_GOOGLE_REFRESH_TOKEN}
									errorMessage={errors.googleRefreshToken?.message}
									{...register("googleRefreshToken")}
								/>

								{/* Botones de acción */}
								<div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-end">
									<Button
										type="button"
										variant="outline"
										onClick={onProbarConexion}
										isLoading={verificando}
										disabled={isSubmitting}
										className="w-full sm:w-auto"
									>
										<RefreshCw size={16} className="mr-2" />
										Verificar Conexión
									</Button>

									<Button
										type="submit"
										variant="default"
										isLoading={isSubmitting}
										disabled={verificando}
										className="w-full sm:w-auto"
									>
										<Save size={16} className="mr-2" />
										Guardar Configuración
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>

				{/* Columna derecha: Tarjeta informativa y guía */}
				<div>
					<TarjetaGuiaGoogle />
				</div>
			</div>
		</div>
	);
}

export default ConfiguracionPage;
