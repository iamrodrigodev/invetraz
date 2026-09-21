import { ExternalLink, FolderGit2 } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button } from "../../../components/ui";
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

	const conexion = useVerificacionConexion<string>({
		valorActual: idActual,
		valorGuardado: carpetaId,
		sonIguales: (a, b) => (a ?? "") === (b ?? ""),
		esValido: camposCompletos,
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

	const onGuardarFormulario = async (e: React.FormEvent) => {
		e.preventDefault();
		await conexion.ejecutarGuardar();
	};

	const cabeceraVinculada = carpetaId ? (
		<div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
			<div className="space-y-1">
				<div className="flex items-center gap-2">
					<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
						Carpeta vinculada:
					</span>
					<Badge variant="slate" className="font-bold">
						{carpetaNombre || "Carpeta de Google Drive"}
					</Badge>
				</div>
				<p className="font-mono text-xs text-slate-500 break-all">
					ID: {carpetaId}
				</p>
			</div>
			<a
				href={`https://drive.google.com/drive/folders/${carpetaId}`}
				target="_blank"
				rel="noreferrer"
				className="shrink-0"
			>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="text-xs text-slate-700 hover:text-emerald-700 w-full sm:w-auto"
				>
					<ExternalLink size={14} className="mr-1.5" />
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
			mensajeError={conexion.mensajeError}
			onLimpiarExito={() => conexion.setMensajeExito(null)}
			onLimpiarError={() => conexion.setMensajeError(null)}
			verificando={conexion.verificando}
			guardando={conexion.guardando}
			deshabilitarVerificar={conexion.deshabilitarVerificar}
			deshabilitarGuardar={conexion.deshabilitarGuardar}
			tooltipVerificar={conexion.tooltipVerificar}
			tooltipGuardar={conexion.tooltipGuardar}
			onVerificar={conexion.ejecutarVerificar}
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
				showCount={false}
				value={inputUrl}
				onChange={(e) => {
					setInputUrl(e.target.value);
					if (conexion.mensajeError) conexion.setMensajeError(null);
				}}
				disabled={conexion.verificando || conexion.guardando}
				error={Boolean(
					conexion.mensajeError || conexion.estadoVisual === "error",
				)}
			/>
		</TarjetaConexionBase>
	);
};

export default TarjetaCarpetaDrive;
