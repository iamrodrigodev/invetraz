import {
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
	Input,
} from "../../../components/ui";
import { vincularCarpetaDrive } from "../../plantillas/api/plantillas.api";

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
		<Card className="border-slate-200/90 bg-white">
			<CardHeader>
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-2 text-primary font-semibold">
						<FolderGit2 size={18} />
						<span>Google Drive</span>
					</div>
					{carpetaId ? (
						<Badge variant="success" className="w-fit font-semibold text-xs">
							<CheckCircle2 size={13} className="mr-1 text-emerald-600" />
							Carpeta vinculada
						</Badge>
					) : (
						<Badge variant="warning" className="w-fit font-semibold text-xs">
							Sin carpeta vinculada
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

			<CardContent className="space-y-4">
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
					<div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<div className="space-y-0.5">
							<span className="font-semibold text-slate-900 block">
								{carpetaNombre || "Carpeta configurada"}
							</span>
							<span className="font-mono text-[11px] text-slate-500 break-all">
								ID: {carpetaId}
							</span>
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
								<ExternalLink size={13} className="mr-1.5" />
								Abrir en Drive
							</Button>
						</a>
					</div>
				)}

				<form onSubmit={onVincular} className="space-y-3 pt-1">
					<div className="space-y-1.5">
						<label
							htmlFor="carpetaUrlOId"
							className="block font-semibold text-slate-800 text-xs"
						>
							{carpetaId
								? "Cambiar carpeta vinculada (Enlace o ID):"
								: "Enlace o ID de la carpeta de Google Drive:"}
						</label>
						<Input
							id="carpetaUrlOId"
							type="text"
							value={inputUrl}
							onChange={(e) => setInputUrl(e.target.value)}
							placeholder="ej. https://drive.google.com/drive/folders/1abc123... o 1abc123..."
							className="text-xs h-9 font-mono"
							disabled={vinculando}
						/>
						<p className="text-[11px] text-slate-500">
							Asegúrate de que la cuenta de Google configurada tenga permisos de
							lectura sobre esta carpeta y que el scope de Drive esté
							habilitado.
						</p>
					</div>

					<div className="flex justify-end pt-1">
						<Button
							type="submit"
							variant="default"
							size="sm"
							disabled={vinculando || !inputUrl.trim()}
							className="w-full sm:w-auto text-xs"
						>
							{vinculando ? (
								<RefreshCw size={14} className="mr-1.5 animate-spin" />
							) : (
								<Link2 size={14} className="mr-1.5" />
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
