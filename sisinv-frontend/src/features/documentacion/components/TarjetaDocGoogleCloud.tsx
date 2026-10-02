import { Check, Cloud, Copy, ExternalLink } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/Button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.tsx";
import { useCopiarTexto } from "@/features/documentacion/hooks/useCopiarTexto.ts";

const URI_REDIRECCION = "https://developers.google.com/oauthplayground";

export const TarjetaDocGoogleCloud: React.FC = () => {
	const { copiadoId, copiar } = useCopiarTexto();
	const copiado = copiadoId === "unico";

	const copiarUri = () => copiar(URI_REDIRECCION);

	return (
		<Card className="flex h-full flex-col border-slate-200/80 bg-white">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 font-bold text-base text-slate-900 tracking-tight">
					<Cloud size={19} className="shrink-0 text-primary" />
					<span>1. Google Cloud (Proyecto y OAuth 2.0)</span>
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col justify-between space-y-4 text-slate-700 text-xs leading-relaxed">
				<ol className="list-inside list-decimal space-y-2.5">
					<li>
						Ingresa a <strong>Google Cloud Console</strong> y crea o selecciona un proyecto.
					</li>
					<li>
						En <strong>Pantalla de consentimiento OAuth</strong>: elige tipo{" "}
						<strong>Externo</strong> y agrega los correos de administradores en{" "}
						<strong>Usuarios de prueba</strong>.
					</li>
					<li>
						En <strong>Credenciales</strong>: crea un <strong>ID de cliente de OAuth 2.0</strong> de
						tipo <strong>Aplicación web</strong>.
					</li>
					<li className="space-y-1.5">
						<span>
							En <strong>URIs de redireccionamiento autorizados</strong>, agrega:
						</span>
						<div className="mt-1 flex items-center gap-2">
							<code className="flex-1 select-all break-all rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-800">
								{URI_REDIRECCION}
							</code>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={copiarUri}
								className="shrink-0"
							>
								{copiado ? <Check size={13} /> : <Copy size={13} />}
								<span>{copiado ? "Copiado" : "Copiar"}</span>
							</Button>
						</div>
					</li>
					<li>
						Copia el <strong>Client ID</strong> y <strong>Client Secret</strong> para registrarlos
						en el sistema y en OAuth Playground.
					</li>
				</ol>

				<div className="pt-2">
					<a
						href="https://console.cloud.google.com"
						target="_blank"
						rel="noreferrer"
						className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
					>
						<ExternalLink size={16} className="mr-2" />
						Ir a Google Cloud Console
					</a>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaDocGoogleCloud;
