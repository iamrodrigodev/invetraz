import { ExternalLink, FolderGit2 } from "lucide-react";
import type React from "react";
import { useId } from "react";
import { Alert } from "@/components/ui/Alert.tsx";
import { VALIDATION_LIMITS } from "@/constants/validations.ts";
import { CampoCredencial } from "@/features/configuracion/components/CampoCredencial.tsx";
import type { TipoEstadoConexion } from "@/features/configuracion/components/EstadoConexionBadge.tsx";
import { TarjetaConexionBase } from "@/features/configuracion/components/TarjetaConexionBase.tsx";
import { useCarpetaDriveConfig } from "@/features/configuracion/hooks/useCarpetaDriveConfig.ts";
import type { EstadoCarpetaDrive } from "@/features/drive/estadoCarpetaDrive.ts";
import { TarjetaCarpetaVinculada } from "@/features/drive/TarjetaCarpetaVinculada.tsx";

type TarjetaCarpetaDriveProps = {
	carpetaIdInicial?: string | null | undefined;
	carpetaNombreInicial?: string | null | undefined;
	carpetaVerificadaInicial?: boolean | undefined;
	onCarpetaActualizada?: (id: string, nombre: string | null, verificado?: boolean) => void;
	estadoCredencialesGoogle?: TipoEstadoConexion | undefined;
};

export const TarjetaCarpetaDrive: React.FC<TarjetaCarpetaDriveProps> = (props) => {
	const carpetaUrlOIdId = useId();
	const {
		carpetaId,
		inputUrl,
		vistaCarpeta,
		conexion,
		credencialesGoogleVerificadas,
		credencialesGoogleVerificando,
		estadoConexionCarpeta,
		mensajeErrorCampo,
		mensajeErrorBanner,
		verificar,
		guardar,
		limpiarError,
		cambiarInput,
		marcarTocado,
	} = useCarpetaDriveConfig(props);

	const estadoTarjetaCarpeta: EstadoCarpetaDrive = (() => {
		if (conexion.verificando || credencialesGoogleVerificando) {
			return "verificando";
		}
		if (!credencialesGoogleVerificadas) {
			return "no_disponible";
		}
		if (credencialesGoogleVerificadas && estadoConexionCarpeta === "conectado") {
			return "verificada";
		}
		return "pendiente";
	})();

	const tarjetaCarpeta = carpetaId ? (
		<TarjetaCarpetaVinculada
			nombre={vistaCarpeta.nombreVisible}
			carpetaId={carpetaId}
			textoBoton="Abrir en Drive"
			estado={estadoTarjetaCarpeta}
		/>
	) : null;

	return (
		<TarjetaConexionBase
			titulo="Carpeta de Plantillas de Seguimiento"
			descripcion="Indica la carpeta de Google Drive donde residen los formatos y plantillas (.xlsx). El sistema leerá los archivos directamente en vivo."
			icono={FolderGit2}
			estado={estadoConexionCarpeta}
			mensajeExito={conexion.mensajeExito}
			varianteMensajeExito={vistaCarpeta.estaPendiente ? "warning" : "success"}
			mensajeError={mensajeErrorBanner}
			onLimpiarExito={() => conexion.setMensajeExito(null)}
			onLimpiarError={limpiarError}
			verificando={conexion.verificando}
			guardando={conexion.guardando}
			deshabilitarVerificar={!credencialesGoogleVerificadas || conexion.deshabilitarVerificar}
			deshabilitarGuardar={conexion.deshabilitarGuardar}
			tooltipVerificar={
				credencialesGoogleVerificando
					? "Espera a que finalice la verificación de Google Cloud"
					: credencialesGoogleVerificadas
						? conexion.tooltipVerificar
						: "Primero verifica las credenciales de Google Cloud"
			}
			tooltipGuardar={conexion.tooltipGuardar}
			onVerificar={verificar}
			esFormulario={true}
			onSubmit={guardar}
			cabeceraExtra={
				<>
					{!(credencialesGoogleVerificadas || credencialesGoogleVerificando) && (
						<Alert
							variant="warning"
							message="Como las credenciales de Google Cloud no están verificadas, tampoco lo estarán en las plantillas de seguimiento. Verifica esa conexión antes de usar Drive o plantillas."
						/>
					)}
					{tarjetaCarpeta}
				</>
			}
		>
			<CampoCredencial
				id={carpetaUrlOIdId}
				label={
					carpetaId ? "Cambiar carpeta vinculada" : "Enlace o ID de la carpeta de Google Drive"
				}
				obligatorio={true}
				descripcion={
					<span>
						Indica el enlace web o el identificador de la carpeta donde se almacenan las plantillas
						(.xlsx). La cuenta configurada debe tener permisos de lectura.{" "}
						<a
							href="https://drive.google.com"
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
						>
							Google Drive <ExternalLink size={11} />
						</a>
					</span>
				}
				placeholder="ej. https://drive.google.com/drive/folders/1abc123... o 1abc123..."
				maxLength={VALIDATION_LIMITS.MAX_GOOGLE_DRIVE_FOLDER_ID}
				charCount={inputUrl.length}
				value={inputUrl}
				onChange={(e) => cambiarInput(e.target.value)}
				onBlur={marcarTocado}
				disabled={conexion.verificando || conexion.guardando}
				error={Boolean(mensajeErrorCampo)}
				errorMessage={mensajeErrorCampo}
			/>
		</TarjetaConexionBase>
	);
};

export default TarjetaCarpetaDrive;
