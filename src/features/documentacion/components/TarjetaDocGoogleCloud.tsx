import { Check, Cloud, Copy, ExternalLink } from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../components/ui";

const URI_REDIRECCION = "https://developers.google.com/oauthplayground";

export const TarjetaDocGoogleCloud: React.FC = () => {
	const [copiado, setCopiado] = useState(false);

	const copiarUri = async () => {
		try {
			await navigator.clipboard.writeText(URI_REDIRECCION);
			setCopiado(true);
			setTimeout(() => setCopiado(false), 2000);
		} catch {
			const input = document.createElement("textarea");
			input.value = URI_REDIRECCION;
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
					<Cloud size={19} className="text-primary shrink-0" />
					<span>1. Google Cloud (Proyecto y OAuth 2.0)</span>
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col flex-1 justify-between space-y-4 text-xs text-slate-700 leading-relaxed">
				<ol className="list-decimal list-inside space-y-2.5">
					<li>
						Ingresa a <strong>Google Cloud Console</strong> y crea o selecciona
						un proyecto.
					</li>
					<li>
						En <strong>Pantalla de consentimiento OAuth</strong>: elige tipo{" "}
						<strong>Externo</strong> y agrega los correos de administradores en{" "}
						<strong>Usuarios de prueba</strong>.
					</li>
					<li>
						En <strong>Credenciales</strong>: crea un{" "}
						<strong>ID de cliente de OAuth 2.0</strong> de tipo{" "}
						<strong>Aplicación web</strong>.
					</li>
					<li className="space-y-1.5">
						<span>
							En <strong>URIs de redireccionamiento autorizados</strong>,
							agrega:
						</span>
						<div className="flex items-center gap-2 mt-1">
							<code className="font-mono text-[11px] bg-slate-50 border border-slate-200 rounded px-2 py-1 select-all break-all text-slate-800 flex-1">
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
						Copia el <strong>Client ID</strong> y <strong>Client Secret</strong>{" "}
						para registrarlos en el sistema y en OAuth Playground.
					</li>
				</ol>

				<div className="pt-2">
					<a
						href="https://console.cloud.google.com"
						target="_blank"
						rel="noreferrer"
						className="inline-block w-full sm:w-auto"
					>
						<Button
							type="button"
							variant="default"
							className="w-full sm:w-auto font-medium"
						>
							<ExternalLink size={16} className="mr-2" />
							Ir a Google Cloud Console
						</Button>
					</a>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaDocGoogleCloud;
