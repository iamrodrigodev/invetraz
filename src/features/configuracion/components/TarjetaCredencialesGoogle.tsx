import { ExternalLink, Key } from "lucide-react";
import type React from "react";
import { VALIDATION_LIMITS } from "../../../constants/validations";
import { useCredencialesGoogleConfig } from "../hooks/useCredencialesGoogleConfig";
import { CampoCredencial } from "./CampoCredencial";
import { TarjetaConexionBase } from "./TarjetaConexionBase";

export const TarjetaCredencialesGoogle: React.FC = () => {
	const {
		form: {
			register,
			formState: { errors },
		},
		campos: { clientId, clientSecret, refreshToken },
		conexion,
		mensajeErrorBanner,
		probarConexion,
		guardarFormulario,
		limpiarError,
	} = useCredencialesGoogleConfig();

	return (
		<TarjetaConexionBase
			titulo="Credenciales de Google Cloud"
			descripcion="Configuración de acceso para la API de Google Classroom"
			icono={Key}
			estado={conexion.estadoVisual}
			mensajeExito={conexion.mensajeExito}
			varianteMensajeExito={
				conexion.estadoVisual === "guardado_pendiente" ? "warning" : "success"
			}
			mensajeError={mensajeErrorBanner}
			onLimpiarExito={() => conexion.setMensajeExito(null)}
			onLimpiarError={limpiarError}
			verificando={conexion.verificando}
			guardando={conexion.guardando}
			deshabilitarVerificar={conexion.deshabilitarVerificar}
			deshabilitarGuardar={conexion.deshabilitarGuardar}
			tooltipVerificar={conexion.tooltipVerificar}
			tooltipGuardar={conexion.tooltipGuardar}
			onVerificar={probarConexion}
			esFormulario={true}
			onSubmit={guardarFormulario}
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
				error={Boolean(errors.googleClientId)}
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
				error={Boolean(errors.googleClientSecret)}
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
				error={Boolean(errors.googleRefreshToken)}
				errorMessage={errors.googleRefreshToken?.message}
				{...register("googleRefreshToken")}
			/>
		</TarjetaConexionBase>
	);
};

export default TarjetaCredencialesGoogle;
