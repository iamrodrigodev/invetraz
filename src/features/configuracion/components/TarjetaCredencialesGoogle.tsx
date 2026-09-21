import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Key } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { VALIDATION_LIMITS } from "../../../constants/validations";
import { useVerificacionConexion } from "../hooks";
import {
	sonCredencialesIguales,
	useConfiguracionStore,
} from "../store/useConfiguracionStore";
import {
	type ActualizarCredencialesPeticion,
	ActualizarCredencialesPeticionSchema,
} from "../types/ActualizarCredencialesPeticion";
import { CampoCredencial } from "./CampoCredencial";
import { TarjetaConexionBase } from "./TarjetaConexionBase";

export const TarjetaCredencialesGoogle: React.FC = () => {
	const { credenciales, guardarConfiguracion, verificarConexion } =
		useConfiguracionStore();

	const {
		register,
		handleSubmit,
		reset,
		trigger,
		watch,
		formState: { errors },
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

	const valoresActuales: ActualizarCredencialesPeticion = useMemo(
		() => ({
			googleClientId: clientId || "",
			googleClientSecret: clientSecret || "",
			googleRefreshToken: refreshToken || "",
			googleDriveFolderId: credenciales.googleDriveFolderId,
			googleDriveFolderName: credenciales.googleDriveFolderName,
		}),
		[
			clientId,
			clientSecret,
			refreshToken,
			credenciales.googleDriveFolderId,
			credenciales.googleDriveFolderName,
		],
	);

	const camposCompletos = Boolean(
		valoresActuales.googleClientId.trim() &&
			valoresActuales.googleClientSecret.trim() &&
			valoresActuales.googleRefreshToken.trim(),
	);

	const tieneErrores = Boolean(
		errors.googleClientId ||
			errors.googleClientSecret ||
			errors.googleRefreshToken,
	);

	const configuracionCompleta = camposCompletos && !tieneErrores;

	const tieneValorGuardado = Boolean(
		credenciales.googleClientId &&
			credenciales.googleClientSecret &&
			credenciales.googleRefreshToken,
	);

	const sincronizadoRef = useRef(false);
	useEffect(() => {
		if (tieneValorGuardado && !sincronizadoRef.current) {
			sincronizadoRef.current = true;
			reset(credenciales);
		}
	}, [credenciales, reset, tieneValorGuardado]);

	const conexion = useVerificacionConexion<ActualizarCredencialesPeticion>({
		valorActual: valoresActuales,
		valorGuardado: credenciales,
		sonIguales: sonCredencialesIguales,
		esValido: configuracionCompleta,
		tieneValorGuardado,
		onVerificar: async (val) => {
			const res = await verificarConexion(val);
			return (
				res?.mensaje ||
				"¡Conexión verificada exitosamente con Google Classroom!"
			);
		},
		onGuardar: async (val) => {
			const res = await guardarConfiguracion(val);
			reset(val);
			return (
				res?.mensaje ||
				"Credenciales verificadas con Google y guardadas exitosamente."
			);
		},
		mensajeValidacionIncompleta:
			"Completa todos los campos requeridos antes de continuar",
		mensajeFalloPrevio:
			"Estas credenciales fallaron la validación. Modifícalas para intentar guardar.",
		mensajeSinCambios: "Modifica al menos un campo para guardar cambios",
	});

	const onProbarConexion = async () => {
		const formValido = await trigger();
		if (!formValido) {
			conexion.setMensajeError(
				"Por favor, completa todos los campos requeridos antes de verificar.",
			);
			return;
		}
		await conexion.ejecutarVerificar();
	};

	const onGuardarFormulario = handleSubmit(async () => {
		await conexion.ejecutarGuardar();
	});

	return (
		<TarjetaConexionBase
			titulo="Credenciales de Google Cloud"
			descripcion="Configuración de acceso para la API de Google Classroom"
			icono={Key}
			estado={conexion.estadoVisual}
			mensajeExito={conexion.mensajeExito}
			mensajeError={conexion.mensajeError}
			onLimpiarExito={() => conexion.setMensajeExito(null)}
			onLimpiarError={() => conexion.setMensajeError(null)}
			verificando={conexion.verificando}
			guardando={conexion.guardando}
			deshabilitarVerificar={conexion.deshabilitarVerificar}
			deshabilitarGuardar={conexion.deshabilitarGuardar}
			tooltipVerificar={conexion.tooltipVerificar}
			tooltipGuardar={conexion.tooltipGuardar}
			onVerificar={onProbarConexion}
			esFormulario={true}
			onSubmit={onGuardarFormulario}
		>
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
				charCount={clientId?.length ?? 0}
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
				charCount={clientSecret?.length ?? 0}
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
				charCount={refreshToken?.length ?? 0}
				errorMessage={errors.googleRefreshToken?.message}
				{...register("googleRefreshToken")}
			/>
		</TarjetaConexionBase>
	);
};

export default TarjetaCredencialesGoogle;
