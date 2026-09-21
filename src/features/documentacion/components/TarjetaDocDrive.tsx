import { Check, Copy, ExternalLink, FolderGit2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../../components/ui";

const SCOPE_DRIVE = "https://www.googleapis.com/auth/drive.readonly";

export const TarjetaDocDrive: React.FC = () => {
	const [copiado, setCopiado] = useState(false);

	const copiarScope = async () => {
		try {
			await navigator.clipboard.writeText(SCOPE_DRIVE);
			setCopiado(true);
			setTimeout(() => setCopiado(false), 2000);
		} catch {
			const input = document.createElement("textarea");
			input.value = SCOPE_DRIVE;
			document.body.appendChild(input);
			input.select();
			document.execCommand("copy");
			document.body.removeChild(input);
			setCopiado(true);
			setTimeout(() => setCopiado(false), 2000);
		}
	};

	return (
		<Card className="flex flex-col h-full border-slate-200/80 bg-white">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-primary font-semibold text-sm">
						<FolderGit2 size={18} />
						<span>Google Drive</span>
					</div>
					<Badge variant="warning" className="font-semibold text-xs">
						Paso 3
					</Badge>
				</div>
				<CardTitle className="text-base text-slate-900 font-bold tracking-tight">
					Google Drive API y Carpeta de Plantillas
				</CardTitle>
				<CardDescription>
					Habilita la API de Drive y autoriza la lectura directa de formatos y
					plantillas (.xlsx) de investigación.
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col flex-1 justify-between space-y-4 text-xs text-slate-700 leading-relaxed">
				<div className="space-y-3">
					<div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-1">
						<p className="font-semibold text-slate-900">
							1. Habilitar Google Drive API en Google Cloud
						</p>
						<p className="text-slate-600">
							En tu proyecto de Google Cloud, ingresa a{" "}
							<em>APIs y servicios &gt; Biblioteca</em>, busca{" "}
							<strong>Google Drive API</strong> y haz clic en{" "}
							<strong>Habilitar</strong>.
						</p>
					</div>

					<div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-1">
						<p className="font-semibold text-slate-900">
							2. Crear y compartir la carpeta de plantillas
						</p>
						<p className="text-slate-600">
							Crea una carpeta en Google Drive donde residirán las plantillas
							oficiales de seguimiento en formato Excel (<strong>.xlsx</strong>
							). Asegúrate de que la cuenta Google institucional tenga permisos
							de lectura sobre dicha carpeta.
						</p>
					</div>

					<div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 space-y-2">
						<div className="flex items-center justify-between">
							<div>
								<span className="font-semibold text-slate-900 block">
									3. Scope requerido de Google Drive:
								</span>
								<span className="text-slate-500 text-[11px] block">
									Acceso de lectura a metadatos y contenido de archivos
								</span>
							</div>
							<button
								type="button"
								onClick={copiarScope}
								className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer font-medium text-[11px] shrink-0"
							>
								{copiado ? (
									<>
										<Check size={12} />
										<span>Copiado</span>
									</>
								) : (
									<>
										<Copy size={12} />
										<span>Copiar</span>
									</>
								)}
							</button>
						</div>
						<p className="font-mono text-[10.5px] bg-white border border-slate-200 rounded px-2 py-1 select-all break-all text-slate-800">
							{SCOPE_DRIVE}
						</p>
					</div>

					<div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-1">
						<p className="font-semibold text-slate-900">
							4. Vinculación en el sistema
						</p>
						<p className="text-slate-600">
							En la sección de Configuración, puedes pegar el enlace web
							completo (ej.{" "}
							<em>https://drive.google.com/drive/folders/ID...</em>) o
							únicamente el identificador alfanumérico de la carpeta.
						</p>
					</div>
				</div>

				<div className="pt-2 flex flex-wrap gap-2">
					<a
						href="https://console.cloud.google.com/apis/library/drive.googleapis.com"
						target="_blank"
						rel="noreferrer"
						className="inline-block w-full sm:w-auto"
					>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="w-full sm:w-auto text-xs"
						>
							<ExternalLink size={14} className="mr-1.5" />
							Habilitar Drive API en Google Cloud
						</Button>
					</a>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaDocDrive;
