import { Check, Copy, ExternalLink, FolderGit2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
	Button,
	Card,
	CardContent,
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
				<CardTitle className="flex items-center gap-2 text-base text-slate-900 font-bold tracking-tight">
					<FolderGit2 size={19} className="text-primary shrink-0" />
					<span>3. Google Drive API</span>
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col flex-1 justify-between space-y-4 text-xs text-slate-700 leading-relaxed">
				<ol className="list-decimal list-inside space-y-2.5">
					<li>
						En Google Cloud, ve a{" "}
						<strong>APIs y servicios &gt; Biblioteca</strong>, busca{" "}
						<strong>Google Drive API</strong> y haz clic en{" "}
						<strong>Habilitar</strong>.
					</li>
					<li>
						Crea una carpeta en Google Drive para las plantillas (
						<strong>.xlsx</strong>) y compártela con permisos de lectura con la
						cuenta institucional.
					</li>
					<li className="space-y-1.5">
						<span>Scope requerido de Google Drive:</span>
						<div className="flex items-center gap-2 mt-1">
							<code className="font-mono text-[10.5px] bg-slate-50 border border-slate-200 rounded px-2 py-1 select-all break-all text-slate-800 flex-1">
								{SCOPE_DRIVE}
							</code>
							<Button
								type="button"
								variant="default"
								size="sm"
								onClick={copiarScope}
								className="h-6 px-2 text-[11px] shrink-0"
							>
								{copiado ? (
									<>
										<Check size={11} className="mr-1" />
										<span>Copiado</span>
									</>
								) : (
									<>
										<Copy size={11} className="mr-1" />
										<span>Copiar</span>
									</>
								)}
							</Button>
						</div>
					</li>
					<li>
						Copia el enlace o identificador de la carpeta y regístralo en la
						tarjeta de Google Drive en Configuración.
					</li>
				</ol>

				<div className="pt-2">
					<a
						href="https://console.cloud.google.com/apis/library/drive.googleapis.com"
						target="_blank"
						rel="noreferrer"
						className="inline-block w-full sm:w-auto"
					>
						<Button
							type="button"
							variant="default"
							size="sm"
							className="w-full sm:w-auto"
						>
							<ExternalLink size={14} className="mr-1.5" />
							Habilitar Drive API
						</Button>
					</a>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaDocDrive;
