import { Check, Cloud, Copy, ExternalLink } from "lucide-react";
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

const URI_REDICCION = "https://developers.google.com/oauthplayground";

export const TarjetaDocGoogleCloud: React.FC = () => {
	const [copiado, setCopiado] = useState(false);

	const copiarUri = async () => {
		try {
			await navigator.clipboard.writeText(URI_REDICCION);
			setCopiado(true);
			setTimeout(() => setCopiado(false), 2000);
		} catch {
			const input = document.createElement("textarea");
			input.value = URI_REDICCION;
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
						<Cloud size={18} />
						<span>Plataforma Google</span>
					</div>
					<Badge variant="slate" className="font-semibold text-xs">
						Paso 1
					</Badge>
				</div>
				<CardTitle className="text-base text-slate-900 font-bold tracking-tight">
					Google Cloud Console (Proyecto y OAuth 2.0)
				</CardTitle>
				<CardDescription>
					Configura el proyecto en la nube y crea las credenciales de cliente
					para el sistema.
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col flex-1 justify-between space-y-4 text-xs text-slate-700 leading-relaxed">
				<div className="space-y-3">
					<div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-1">
						<p className="font-semibold text-slate-900">
							1. Crear proyecto en Google Cloud
						</p>
						<p className="text-slate-600">
							Accede a la consola de Google Cloud y crea un nuevo proyecto o
							selecciona uno existente para alojar la integración institucional.
						</p>
					</div>

					<div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-1">
						<p className="font-semibold text-slate-900">
							2. Pantalla de consentimiento OAuth
						</p>
						<p className="text-slate-600">
							Ve a <em>APIs y servicios &gt; Pantalla de consentimiento</em>.
							Elige el tipo de usuario <strong>Externo</strong> y registra los
							correos de los administradores en la sección{" "}
							<strong>Usuarios de prueba (Test users)</strong>.
						</p>
					</div>

					<div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-2">
						<p className="font-semibold text-slate-900">
							3. Crear ID de cliente OAuth 2.0
						</p>
						<p className="text-slate-600">
							En{" "}
							<em>
								Credenciales &gt; Crear credenciales &gt; ID de cliente de OAuth
							</em>
							, selecciona <strong>Aplicación web</strong>.
						</p>
						<div className="space-y-1 pt-1">
							<div className="flex items-center justify-between text-[11px]">
								<span className="font-medium text-slate-700">
									URI de redireccionamiento autorizado obligatorio:
								</span>
								<button
									type="button"
									onClick={copiarUri}
									className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer font-medium"
								>
									{copiado ? (
										<>
											<Check size={12} />
											<span>Copiado</span>
										</>
									) : (
										<>
											<Copy size={12} />
											<span>Copiar URI</span>
										</>
									)}
								</button>
							</div>
							<p className="font-mono text-[11px] bg-white border border-slate-200 rounded px-2 py-1 select-all break-all text-slate-800">
								{URI_REDICCION}
							</p>
						</div>
					</div>

					<div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-1">
						<p className="font-semibold text-slate-900">
							4. Copiar Client ID y Client Secret
						</p>
						<p className="text-slate-600">
							Al guardar, obtendrás el <strong>Google Client ID</strong> y el{" "}
							<strong>Google Client Secret</strong>. Consérvalos para guardarlos
							en el panel de Configuración y en OAuth Playground.
						</p>
					</div>
				</div>

				<div className="pt-2">
					<a
						href="https://console.cloud.google.com"
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
							Ir a Google Cloud Console
						</Button>
					</a>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaDocGoogleCloud;
