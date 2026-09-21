import { ExternalLink, FolderGit2 } from "lucide-react";
import type React from "react";
import { TarjetaCarpetaVinculada } from "../../../components/drive/TarjetaCarpetaVinculada";
import { Alert } from "../../../components/ui";
import { VALIDATION_LIMITS } from "../../../constants/validations";
import { useCarpetaDriveConfig } from "../hooks/useCarpetaDriveConfig";
import { CampoCredencial } from "./CampoCredencial";
import type { TipoEstadoConexion } from "./EstadoConexionBadge";
import { TarjetaConexionBase } from "./TarjetaConexionBase";

interface TarjetaCarpetaDriveProps {
	carpetaIdInicial?: string | null | undefined;
	carpetaNombreInicial?: string | null | undefined;
	carpetaVerificadaInicial?: boolean | undefined;
	onCarpetaActualizada?: (
		id: string,
		nombre: string | null,
		verificado?: boolean,
	) => void;
	estadoCredencialesGoogle?: TipoEstadoConexion | undefined;
}

export const TarjetaCarpetaDrive: React.FC<TarjetaCarpetaDriveProps> = (
	props,
) => {
	const {
		carpetaId,
		inputUrl,
		vistaCarpeta,
		conexion,
		credencialesGoogleVerificadas,
		estadoConexionCarpeta,
		mensajeErrorCampo,
		mensajeErrorBanner,
		verificar,
		guardar,
		limpiarError,
		cambiarInput,
		marcarTocado,
	} = useCarpetaDriveConfig(props);

	const tarjetaCarpeta = carpetaId ? (
		<TarjetaCarpetaVinculada
			nombre={vistaCarpeta.nombreVisible}
			carpetaId={carpetaId}
			textoBoton="Abrir en Drive"
			estado={
				credencialesGoogleVerificadas && estadoConexionCarpeta === "conectado"
					? "verificada"
					: "pendiente"
			}
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
			deshabilitarVerificar={
				!credencialesGoogleVerificadas || conexion.deshabilitarVerificar
			}
			deshabilitarGuardar={conexion.deshabilitarGuardar}
			tooltipVerificar={
				!credencialesGoogleVerificadas
					? "Primero verifica las credenciales de Google Cloud"
					: conexion.tooltipVerificar
			}
			tooltipGuardar={conexion.tooltipGuardar}
			onVerificar={verificar}
			esFormulario={true}
			onSubmit={guardar}
			cabeceraExtra={
				<>
					{!credencialesGoogleVerificadas && (
						<Alert
							variant="warning"
							message="Google Cloud está guardado, pero no verificado. Verifica esa conexión antes de usar Drive o plantillas."
						/>
					)}
					{tarjetaCarpeta}
				</>
			}
		>
			<CampoCredencial
				id="carpetaUrlOId"
				label={
					carpetaId
						? "Cambiar carpeta vinculada"
						: "Enlace o ID de la carpeta de Google Drive"
				}
				obligatorio
				descripcion={
					<span>
						Indica el enlace web o el identificador de la carpeta donde se
						almacenan las plantillas (.xlsx). La cuenta configurada debe tener
						permisos de lectura.{" "}
						<a
							href="https://drive.google.com"
							target="_blank"
							rel="noreferrer"
							className="font-medium text-primary hover:underline inline-flex items-center gap-0.5"
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
