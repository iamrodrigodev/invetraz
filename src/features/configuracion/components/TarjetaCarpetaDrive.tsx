import {
	AlertCircle,
	CheckCircle2,
	ExternalLink,
	FolderGit2,
	Link2,
	RefreshCw,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
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
import { vincularCarpetaDrive } from "../../plantillas/api/plantillas.api";
import { CampoCredencial } from "./CampoCredencial";

interface TarjetaCarpetaDriveProps {
	carpetaIdInicial?: string | null | undefined;
	carpetaNombreInicial?: string | null | undefined;
	onCarpetaActualizada?: (id: string, nombre: string) => void;
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
	const [inputUrl, setInputUrl] = useState<string>("");
	const [vinculando, setVinculando] = useState<boolean>(false);
	const [mensajeExito, setMensajeExito] = useState<string | null>(null);
	const [mensajeError, setMensajeError] = useState<string | null>(null);

	useEffect(() => {
		if (carpetaIdInicial) setCarpetaId(carpetaIdInicial);
		if (carpetaNombreInicial) setCarpetaNombre(carpetaNombreInicial);
	}, [carpetaIdInicial, carpetaNombreInicial]);

	const onVincular = async (e: React.FormEvent) => {
		e.preventDefault();
		const valorLimpio = inputUrl.trim();
		if (!valorLimpio) return;

		setVinculando(true);
		setMensajeError(null);
		setMensajeExito(null);

		try {
			const res = await vincularCarpetaDrive({ carpetaUrlOId: valorLimpio });
			const nuevoId = res.carpetaId ?? "";
			const nuevoNombre = res.carpetaNombre ?? "Carpeta de Google Drive";
			setCarpetaId(nuevoId);
			setCarpetaNombre(nuevoNombre);
			setInputUrl("");
			setMensajeExito(
				`Carpeta vinculada exitosamente: "${nuevoNombre}" (${res.plantillas.length} ${
					res.plantillas.length === 1 ? "plantilla" : "plantillas"
				} .xlsx encontradas).`,
			);
			onCarpetaActualizada?.(nuevoId, nuevoNombre);
		} catch (err) {
			setMensajeError(
				err instanceof Error
					? err.message
					: "Error al vincular la carpeta de Google Drive",
			);
		} finally {
			setVinculando(false);
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
					{vinculando ? (
						<Badge variant="primary">
							<RefreshCw
								size={13}
								className="shrink-0 animate-spin text-primary"
							/>
							<span>Verificando carpeta...</span>
						</Badge>
					) : carpetaId ? (
						<Badge variant="success">
							<CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
							<span>Carpeta vinculada</span>
						</Badge>
					) : (
						<Badge variant="warning">
							<AlertCircle size={13} className="shrink-0 text-amber-600" />
							<span>Sin carpeta vinculada</span>
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

				<form onSubmit={onVincular} className="space-y-5">
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
						disabled={vinculando}
						errorMessage={mensajeError ?? undefined}
					/>

					<div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-end">
						<Button
							type="submit"
							variant="default"
							disabled={vinculando || !inputUrl.trim()}
							className="w-full sm:w-auto"
						>
							{vinculando ? (
								<RefreshCw size={16} className="mr-2 animate-spin" />
							) : (
								<Link2 size={16} className="mr-2" />
							)}
							{vinculando ? "Verificando carpeta..." : "Vincular y Verificar"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default TarjetaCarpetaDrive;
