import { ExternalLink, FolderCheck, FolderGit2 } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button } from "../../../components/ui";
import { VALIDATION_LIMITS } from "../../../constants/validations";
import {
	verificarCarpetaDrive,
	vincularCarpetaDrive,
} from "../../plantillas/api/plantillas.api";
import { useVerificacionConexion } from "../hooks";
import { CampoCredencial } from "./CampoCredencial";
import { TarjetaConexionBase } from "./TarjetaConexionBase";

interface TarjetaCarpetaDriveProps {
	carpetaIdInicial?: string | null | undefined;
	carpetaNombreInicial?: string | null | undefined;
	onCarpetaActualizada?: (id: string, nombre: string) => void;
}

function normalizarId(entrada: string): string {
	const limpia = entrada.trim();
	if (!limpia) return "";
	const match = /(?:folders\/|id=)([a-zA-Z0-9_-]+)/.exec(limpia);
	if (match?.[1]) return match[1];
	return limpia;
}

export const TarjetaCarpetaDrive: React.FC<TarjetaCarpetaDriveProps> = ({
	carpetaIdInicial,
	carpetaNombreInicial,
	onCarpetaActualizada,
}) => {
	const [carpetaId, setCarpetaId] = useState<string | null>(
		carpetaIdInicial ?? null,
	);
	const [carpetaNombre, setCarpetaNombre] = useState<string | null>(
		carpetaNombreInicial ?? null,
	);
	const [inputUrl, setInputUrl] = useState<string>(carpetaIdInicial ?? "");

	useEffect(() => {
		if (carpetaIdInicial) {
			setCarpetaId(carpetaIdInicial);
			setInputUrl(carpetaIdInicial);
		}
		if (carpetaNombreInicial) {
			setCarpetaNombre(carpetaNombreInicial);
		}
	}, [carpetaIdInicial, carpetaNombreInicial]);

	const idActual = useMemo(() => normalizarId(inputUrl), [inputUrl]);
	const camposCompletos = Boolean(inputUrl.trim());
	const [tocado, setTocado] = useState(false);
	const [errorDescartado, setErrorDescartado] = useState(false);

	const errorValidacion = useMemo(() => {
		const limpia = inputUrl.trim();
		if (!limpia) {
			return "El enlace o ID de la carpeta de Google Drive es obligatorio";
		}
		if (inputUrl.length > VALIDATION_LIMITS.MAX_GOOGLE_DRIVE_FOLDER_ID) {
			return `El enlace o ID no puede exceder los ${VALIDATION_LIMITS.MAX_GOOGLE_DRIVE_FOLDER_ID} caracteres`;
		}
		return null;
	}, [inputUrl]);

	const mensajeErrorCampo = tocado ? errorValidacion : null;

	const conexion = useVerificacionConexion<string>({
		valorActual: idActual,
		valorGuardado: carpetaId,
		sonIguales: (a, b) => (a ?? "") === (b ?? ""),
		esValido: Boolean(camposCompletos && !errorValidacion),
		tieneValorGuardado: Boolean(carpetaId),
		onVerificar: async () => {
			const res = await verificarCarpetaDrive({
				carpetaUrlOId: inputUrl.trim(),
			});
			return `¡Conexión verificada exitosamente con Google Drive! Se encontraron ${res.plantillas.length} ${
				res.plantillas.length === 1 ? "plantilla" : "plantillas"
			} .xlsx en "${res.carpetaNombre || "Carpeta de Google Drive"}".`;
		},
		onGuardar: async () => {
			const res = await vincularCarpetaDrive({
				carpetaUrlOId: inputUrl.trim(),
			});
			const nuevoId = res.carpetaId ?? idActual;
			const nuevoNombre = res.carpetaNombre ?? "Carpeta de Google Drive";
			setCarpetaId(nuevoId);
			setCarpetaNombre(nuevoNombre);
			onCarpetaActualizada?.(nuevoId, nuevoNombre);
			return `Carpeta verificada con Google y guardada exitosamente: "${nuevoNombre}" (${res.plantillas.length} ${
				res.plantillas.length === 1 ? "plantilla" : "plantillas"
			} .xlsx encontradas).`;
		},
		mensajeValidacionIncompleta:
			"Ingresa un enlace o ID de carpeta antes de continuar",
		mensajeFalloPrevio:
			"Esta carpeta falló la validación. Modifícala para intentar guardar.",
		mensajeSinCambios: "Modifica el enlace o ID para guardar cambios",
	});

	const onProbarConexion = async () => {
		setTocado(true);
		setErrorDescartado(false);
		if (errorValidacion) {
			return;
		}
		await conexion.ejecutarVerificar();
	};

	const onGuardarFormulario = async (e: React.FormEvent) => {
		e.preventDefault();
		setTocado(true);
		setErrorDescartado(false);
		if (errorValidacion) {
			return;
		}
		await conexion.ejecutarGuardar();
	};

	const mensajeErrorBanner =
		conexion.mensajeError ||
		(tocado && !errorDescartado ? errorValidacion : null);

	const onLimpiarError = () => {
		if (conexion.mensajeError) {
			conexion.setMensajeError(null);
		}
		setErrorDescartado(true);
	};

	const cabeceraVinculada = carpetaId ? (
		<div className="rounded-xl border border-slate-200/80 p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 transition-all">
			<div className="flex items-center gap-3 min-w-0">
				<FolderCheck size={24} className="text-primary stroke-[2.2] shrink-0" />
				<div className="space-y-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<span className="text-sm font-medium text-slate-800 truncate">
							{carpetaNombre || "Carpeta de Google Drive"}
						</span>
						<Badge
							variant="primary"
							className="text-[10px] font-normal py-0.5 px-2"
						>
							Carpeta vinculada
						</Badge>
					</div>
					<div className="flex items-center gap-1.5 text-xs">
						<span className="text-slate-500">ID:</span>
						<code className="font-mono text-xs text-slate-700 select-all break-all">
							{carpetaId}
						</code>
					</div>
				</div>
			</div>
			<a
				href={`https://drive.google.com/drive/folders/${carpetaId}`}
				target="_blank"
				rel="noreferrer"
				className="shrink-0 self-end sm:self-auto"
			>
				<Button
					type="button"
					variant="default"
					size="sm"
					className="h-8 px-3 text-xs font-medium w-full sm:w-auto shadow-xs"
				>
					<ExternalLink size={13} className="mr-1.5" />
					Abrir en Drive
				</Button>
			</a>
		</div>
	) : null;

	return (
		<TarjetaConexionBase
			titulo="Carpeta de Plantillas de Seguimiento"
			descripcion="Indica la carpeta de Google Drive donde residen los formatos y plantillas (.xlsx). El sistema leerá los archivos directamente en vivo."
			icono={FolderGit2}
			estado={conexion.estadoVisual}
			mensajeExito={conexion.mensajeExito}
			mensajeError={mensajeErrorBanner}
			onLimpiarExito={() => conexion.setMensajeExito(null)}
			onLimpiarError={onLimpiarError}
			verificando={conexion.verificando}
			guardando={conexion.guardando}
			deshabilitarVerificar={conexion.deshabilitarVerificar}
			deshabilitarGuardar={conexion.deshabilitarGuardar}
			tooltipVerificar={conexion.tooltipVerificar}
			tooltipGuardar={conexion.tooltipGuardar}
			onVerificar={onProbarConexion}
			esFormulario={true}
			onSubmit={onGuardarFormulario}
			cabeceraExtra={cabeceraVinculada}
		>
			<CampoCredencial
				id="carpetaUrlOId"
				label={
					carpetaId
						? "Cambiar carpeta vinculada"
						: "Enlace o ID de la carpeta de Google Drive"
				}
				obligatorio={!carpetaId}
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
				onChange={(e) => {
					setInputUrl(e.target.value);
					setTocado(true);
					setErrorDescartado(false);
					if (conexion.mensajeError) conexion.setMensajeError(null);
					if (conexion.mensajeExito) conexion.setMensajeExito(null);
				}}
				onBlur={() => {
					setTocado(true);
					setErrorDescartado(false);
				}}
				disabled={conexion.verificando || conexion.guardando}
				error={Boolean(mensajeErrorCampo)}
				errorMessage={mensajeErrorCampo}
			/>
		</TarjetaConexionBase>
	);
};

export default TarjetaCarpetaDrive;
