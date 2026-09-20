import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Key, RefreshCw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
	Alert,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	ConfiguracionSkeleton,
} from "../../../components/ui";
import { VALIDATION_LIMITS } from "../../../constants/validations";
import {
	CampoCredencial,
	EstadoConexionBadge,
	TarjetaGuiaGoogle,
	TarjetaScopesGoogle,
	type TipoEstadoConexion,
} from "../components";
import { useConfiguracionStore } from "../store/useConfiguracionStore";
import {
	type ActualizarCredencialesPeticion,
	ActualizarCredencialesPeticionSchema,
} from "../types/ActualizarCredencialesPeticion";

export function ConfiguracionPage() {
	const {
		credenciales,
		estadoConexion,
		cargado,
		cargarConfiguracion,
		guardarConfiguracion,
		verificarConexion,
	} = useConfiguracionStore();

	const [mensajeExito, setMensajeExito] = useState<string | null>(null);
	const [mensajeError, setMensajeError] = useState<string | null>(null);
	const [verificando, setVerificando] = useState(false);
	const [valoresVerificados, setValoresVerificados] =
		useState<ActualizarCredencialesPeticion | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		getValues,
		trigger,
		watch,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<ActualizarCredencialesPeticion>({
		resolver: zodResolver(ActualizarCredencialesPeticionSchema),
		mode: "onChange",
		defaultValues: credenciales,
	});

	const [clientId, clientSecret, refreshToken] = watch([
		"googleClientId",
		"googleClientSecret",
		"googleRefreshToken",
	]);

	const camposCompletos = Boolean(
		clientId?.trim() && clientSecret?.trim() && refreshToken?.trim(),
	);

	const tieneErrores = Boolean(
		errors.googleClientId ||
			errors.googleClientSecret ||
			errors.googleRefreshToken,
	);

	const configuracionCompleta = camposCompletos && !tieneErrores;
	const deshabilitarVerificar =
		!configuracionCompleta || verificando || isSubmitting;
	const deshabilitarGuardar =
		!configuracionCompleta || !isDirty || isSubmitting || verificando;

	// Si el usuario modifica cualquier campo, limpiamos el mensaje de éxito previo
	useEffect(() => {
		if (isDirty) {
			setMensajeExito(null);
		}
	}, [isDirty]);

	// Comprobamos si los valores actuales en pantalla coinciden con una verificación exitosa reciente
	const formularioCoincideConVerificados = useMemo(() => {
		if (!valoresVerificados) return false;
		return (
			valoresVerificados.googleClientId === clientId &&
			valoresVerificados.googleClientSecret === clientSecret &&
			valoresVerificados.googleRefreshToken === refreshToken
		);
	}, [valoresVerificados, clientId, clientSecret, refreshToken]);

	// Determinación dinámica del estado de la conexión en pantalla
	const estadoConexionVisual: TipoEstadoConexion = useMemo(() => {
		if (verificando || isSubmitting) {
			return "verificando";
		}
		if (!camposCompletos || tieneErrores) {
			return "no_configurado";
		}
		if (formularioCoincideConVerificados) {
			return "conectado";
		}
		if (isDirty) {
			return "no_configurado";
		}
		return estadoConexion;
	}, [
		verificando,
		isSubmitting,
		camposCompletos,
		tieneErrores,
		formularioCoincideConVerificados,
		isDirty,
		estadoConexion,
	]);

	useEffect(() => {
		if (!cargado) {
			cargarConfiguracion()
				.then((datos) => {
					reset(datos);
				})
				.catch((error) => {
					setMensajeError(
						error instanceof Error
							? error.message
							: "Error al cargar la configuración",
					);
				});
		} else {
			reset(credenciales);
		}
	}, [cargado, cargarConfiguracion, credenciales, reset]);

	const onGuardar = async (data: ActualizarCredencialesPeticion) => {
		try {
			setMensajeError(null);
			setMensajeExito(null);

			// guardarConfiguracion verifica primero con Google Classroom y luego persiste
			const res = await guardarConfiguracion(data);
			reset(data);
			setValoresVerificados(data);
			setMensajeExito(
				res?.mensaje ||
					"Credenciales verificadas con Google y guardadas exitosamente.",
			);
		} catch (error) {
			setValoresVerificados(null);
			setMensajeError(
				error instanceof Error
					? error.message
					: "Error al verificar o guardar la configuración con Google Classroom",
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
			const valores = getValues();
			const res = await verificarConexion(valores);
			setValoresVerificados(valores);
			setMensajeExito(
				res.mensaje ||
					"¡Conexión verificada exitosamente con Google Classroom!",
			);
		} catch (error) {
			setValoresVerificados(null);
			setMensajeError(
				error instanceof Error
					? error.message
					: "Error al verificar la conexión con Google Classroom",
			);
		} finally {
			setVerificando(false);
		}
	};

	if (!cargado) {
		return <ConfiguracionSkeleton />;
	}

	return (
		<div className="space-y-6 pb-12">
			{/* Encabezado */}
			<div>
				<h1 className="font-extrabold font-heading text-2xl text-slate-900 tracking-tight sm:text-3xl">
					Configuración de Google Classroom
				</h1>
				<p className="mt-1 text-sm text-slate-600">
					Administra las credenciales de la API de Google para la sincronización
					de clases y tareas.
				</p>
			</div>

			{/* Mensajes de retroalimentación */}
			{mensajeExito && (
				<Alert
					key="alerta-exito"
					variant="success"
					message={mensajeExito}
					onClose={() => setMensajeExito(null)}
				/>
			)}

			{mensajeError && (
				<Alert
					key="alerta-error"
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
								<EstadoConexionBadge estado={estadoConexionVisual} />
							</div>
							<CardTitle className="text-lg text-slate-900 font-bold">
								Credenciales de API de Google
							</CardTitle>
							<CardDescription>
								Ingresa el Client ID, Client Secret y Refresh Token
								correspondientes.
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
										disabled={deshabilitarVerificar}
										className="w-full sm:w-auto"
										title={
											!configuracionCompleta
												? "Completa todos los campos requeridos para verificar la conexión"
												: undefined
										}
									>
										<RefreshCw
											size={16}
											className={`mr-2 ${verificando ? "animate-spin text-primary" : ""}`}
										/>
										{verificando ? "Verificando..." : "Verificar Conexión"}
									</Button>

									<Button
										type="submit"
										variant="default"
										disabled={deshabilitarGuardar}
										className="w-full sm:w-auto"
										title={
											!configuracionCompleta
												? "Completa todos los campos requeridos para guardar"
												: !isDirty
													? "Modifica al menos un campo para guardar cambios"
													: undefined
										}
									>
										{isSubmitting ? (
											<RefreshCw size={16} className="mr-2 animate-spin" />
										) : (
											<Save size={16} className="mr-2" />
										)}
										{isSubmitting
											? "Verificando y guardando..."
											: "Guardar Configuración"}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>

				{/* Columna derecha: Tarjetas informativas y scopes en cards independientes */}
				<div className="space-y-6">
					<TarjetaGuiaGoogle />
					<TarjetaScopesGoogle />
				</div>
			</div>
		</div>
	);
}

export default ConfiguracionPage;
