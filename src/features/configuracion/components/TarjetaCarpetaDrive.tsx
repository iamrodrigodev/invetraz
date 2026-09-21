import {
	AlertCircle,
	CheckCircle2,
	ExternalLink,
	FolderGit2,
	RefreshCw,
	Save,
	XCircle,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
	Alert,
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../../components/ui";
import {
	verificarCarpetaDrive,
	vincularCarpetaDrive,
} from "../../plantillas/api/plantillas.api";
import { CampoCredencial } from "./CampoCredencial";

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
	const [verificando, setVerificando] = useState<boolean>(false);
	const [guardando, setGuardando] = useState<boolean>(false);
	const [mensajeExito, setMensajeExito] = useState<string | null>(null);
	const [mensajeError, setMensajeError] = useState<string | null>(null);

	const [ultimoIntentoGuardado, setUltimoIntentoGuardado] = useState<
		string | null
	>(carpetaIdInicial ?? null);
	const [verificadoEnSesion, setVerificadoEnSesion] = useState<string | null>(
		carpetaIdInicial ? normalizarId(carpetaIdInicial) : null,
	);
	const [falloEnSesion, setFalloEnSesion] = useState<string | null>(null);

	useEffect(() => {
		if (carpetaIdInicial) {
			setCarpetaId(carpetaIdInicial);
			setInputUrl(carpetaIdInicial);
			setUltimoIntentoGuardado(carpetaIdInicial);
			setVerificadoEnSesion(normalizarId(carpetaIdInicial));
		}
		if (carpetaNombreInicial) {
			setCarpetaNombre(carpetaNombreInicial);
		}
	}, [carpetaIdInicial, carpetaNombreInicial]);

	const idActual = useMemo(() => normalizarId(inputUrl), [inputUrl]);
	const camposCompletos = Boolean(inputUrl.trim());

	const esIgualAFallidas = Boolean(falloEnSesion && falloEnSesion === idActual);
	const esIgualAUltimoIntento = Boolean(
		ultimoIntentoGuardado && normalizarId(ultimoIntentoGuardado) === idActual,
	);
	const esIgualAGuardadas = Boolean(carpetaId && carpetaId === idActual);

	const deshabilitarVerificar = !camposCompletos || verificando || guardando;
	const deshabilitarGuardar =
		!camposCompletos ||
		guardando ||
		verificando ||
		esIgualAFallidas ||
		(esIgualAGuardadas && !ultimoIntentoGuardado) ||
		esIgualAUltimoIntento;

	const estadoVisual = useMemo(() => {
		if (verificando || guardando) {
			return "verificando";
		}
		if (!camposCompletos) {
			return carpetaId ? "conectado" : "no_configurado";
		}
		if (esIgualAFallidas) {
			return "error";
		}
		if (
			(verificadoEnSesion && verificadoEnSesion === idActual) ||
			esIgualAGuardadas
		) {
			return "conectado";
		}
		return "no_configurado";
	}, [
		verificando,
		guardando,
		camposCompletos,
		carpetaId,
		esIgualAFallidas,
		verificadoEnSesion,
		idActual,
		esIgualAGuardadas,
	]);

	const onProbarConexion = async () => {
		const valorLimpio = inputUrl.trim();
		if (!valorLimpio) {
			setMensajeError(
				"Por favor, ingresa un enlace o ID de carpeta antes de verificar.",
			);
			return;
		}

		setVerificando(true);
		setMensajeError(null);
		setMensajeExito(null);

		try {
			const res = await verificarCarpetaDrive({ carpetaUrlOId: valorLimpio });
			const idVerificado = res.carpetaId ?? idActual;
			setVerificadoEnSesion(idVerificado);
			setFalloEnSesion(null);
			setMensajeExito(
				`¡Conexión verificada exitosamente con Google Drive! Se encontraron ${res.plantillas.length} ${
					res.plantillas.length === 1 ? "plantilla" : "plantillas"
				} .xlsx en "${res.carpetaNombre || "Carpeta de Google Drive"}".`,
			);
		} catch (err) {
			setFalloEnSesion(idActual);
			setVerificadoEnSesion(null);
			setMensajeError(
				err instanceof Error
					? err.message
					: "Error al verificar la conexión con la carpeta de Google Drive",
			);
		} finally {
			setVerificando(false);
		}
	};

	const onGuardar = async (e: React.FormEvent) => {
		e.preventDefault();
		const valorLimpio = inputUrl.trim();
		if (!valorLimpio) return;

		setGuardando(true);
		setMensajeError(null);
		setMensajeExito(null);
		setUltimoIntentoGuardado(valorLimpio);

		try {
			const res = await vincularCarpetaDrive({ carpetaUrlOId: valorLimpio });
			const nuevoId = res.carpetaId ?? idActual;
			const nuevoNombre = res.carpetaNombre ?? "Carpeta de Google Drive";
			setCarpetaId(nuevoId);
			setCarpetaNombre(nuevoNombre);
			setUltimoIntentoGuardado(valorLimpio);
			setVerificadoEnSesion(nuevoId);
			setFalloEnSesion(null);
			setMensajeExito(
				`Carpeta verificada con Google y guardada exitosamente: "${nuevoNombre}" (${res.plantillas.length} ${
					res.plantillas.length === 1 ? "plantilla" : "plantillas"
				} .xlsx encontradas).`,
			);
			onCarpetaActualizada?.(nuevoId, nuevoNombre);
		} catch (err) {
			setUltimoIntentoGuardado(valorLimpio);
			setFalloEnSesion(idActual);
			setVerificadoEnSesion(null);
			setMensajeError(
				err instanceof Error
					? err.message
					: "Error al verificar o guardar la carpeta de Google Drive",
			);
		} finally {
			setGuardando(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-2 text-primary font-semibold">
						<FolderGit2 size={18} />
						<span>Google Drive</span>
					</div>
					{estadoVisual === "verificando" ? (
						<Badge variant="primary">
							<RefreshCw
								size={13}
								className="shrink-0 animate-spin text-primary"
							/>
							<span>
								{guardando ? "Guardando..." : "Verificando conexión..."}
							</span>
						</Badge>
					) : estadoVisual === "error" ? (
						<Badge variant="destructive">
							<XCircle size={13} className="shrink-0 text-red-600" />
							<span>Error de conexión</span>
						</Badge>
					) : estadoVisual === "conectado" ? (
						<Badge variant="success">
							<CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
							<span>Conexión activa con Google</span>
						</Badge>
					) : (
						<Badge variant="warning">
							<AlertCircle size={13} className="shrink-0 text-amber-600" />
							<span>Pendiente de configuración</span>
						</Badge>
					)}
				</div>
				<CardTitle className="text-lg text-slate-900 font-bold">
					Carpeta de Plantillas de Seguimiento
				</CardTitle>
				<CardDescription>
					Indica la carpeta de Google Drive donde residen los formatos y
					plantillas (.xlsx). El sistema leerá los archivos directamente en
					vivo.
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-5">
				{mensajeExito && (
					<Alert
						key="alerta-carpeta-exito"
						variant="success"
						message={mensajeExito}
						onClose={() => setMensajeExito(null)}
					/>
				)}

				{mensajeError && (
					<Alert
						key="alerta-carpeta-error"
						variant="error"
						message={mensajeError}
						onClose={() => setMensajeError(null)}
					/>
				)}

				{carpetaId && (
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
				)}

				<form onSubmit={onGuardar} className="space-y-5">
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
								almacenan las plantillas (.xlsx). La cuenta configurada debe
								tener permisos de lectura.{" "}
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
							if (mensajeError) setMensajeError(null);
						}}
						disabled={verificando || guardando}
						errorMessage={mensajeError ?? undefined}
					/>

					<div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={onProbarConexion}
							disabled={deshabilitarVerificar}
							className="w-full sm:w-auto"
							title={
								!camposCompletos
									? "Completa el campo para verificar la conexión"
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
								!camposCompletos
									? "Completa el campo para guardar"
									: esIgualAFallidas
										? "Esta carpeta falló la validación. Modifícala para intentar guardar."
										: esIgualAUltimoIntento || esIgualAGuardadas
											? "Modifica el enlace o ID para guardar cambios"
											: undefined
							}
						>
							{guardando ? (
								<RefreshCw size={16} className="mr-2 animate-spin" />
							) : (
								<Save size={16} className="mr-2" />
							)}
							{guardando
								? "Verificando y guardando..."
								: "Guardar Configuración"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default TarjetaCarpetaDrive;
