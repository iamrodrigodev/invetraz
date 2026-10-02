import { Check, Copy, ExternalLink, FolderGit2 } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/Button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.tsx";
import { useCopiarTexto } from "@/features/documentacion/hooks/useCopiarTexto.ts";

const SCOPE_DRIVE = "https://www.googleapis.com/auth/drive.readonly";

export const TarjetaDocDrive: React.FC = () => {
	const { copiadoId, copiar } = useCopiarTexto();
	const copiado = copiadoId === "unico";

	const copiarScope = () => copiar(SCOPE_DRIVE);

	return (
		<Card className="flex h-full flex-col border-slate-200/80 bg-white">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 font-bold text-base text-slate-900 tracking-tight">
					<FolderGit2 size={19} className="shrink-0 text-primary" />
					<span>3. Google Drive API</span>
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col justify-between space-y-4 text-slate-700 text-xs leading-relaxed">
				<ol className="list-inside list-decimal space-y-2.5">
					<li>
						En Google Cloud, ve a <strong>APIs y servicios &gt; Biblioteca</strong>, busca{" "}
						<strong>Google Drive API</strong> y haz clic en <strong>Habilitar</strong>.
					</li>
					<li>
						Crea una carpeta en Google Drive para las plantillas (<strong>.xlsx</strong>) y
						compártela con permisos de lectura con la cuenta institucional.
					</li>
					<li className="space-y-1.5">
						<span>Scope requerido de Google Drive:</span>
						<div className="mt-1 flex items-center gap-2">
							<code className="flex-1 select-all break-all rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[10.5px] text-slate-800">
								{SCOPE_DRIVE}
							</code>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={copiarScope}
								className="h-6 shrink-0 px-2 text-[11px]"
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
						Copia el enlace o identificador de la carpeta y regístralo en la tarjeta de Google Drive
						en Configuración.
					</li>
				</ol>

				<div className="pt-2">
					<a
						href="https://console.cloud.google.com/apis/library/drive.googleapis.com"
						target="_blank"
						rel="noreferrer"
						className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
					>
						<ExternalLink size={16} className="mr-2" />
						Habilitar Drive API
					</a>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaDocDrive;
