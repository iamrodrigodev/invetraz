import { ExternalLink, Info } from "lucide-react";
import type React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../components/ui/Card";

export const TarjetaGuiaGoogle: React.FC = () => {
	return (
		<Card className="border-slate-200/80 bg-white">
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2 text-primary font-semibold text-sm">
					<Info size={16} />
					<span>Guía rápida de integración</span>
				</div>
				<CardTitle className="text-base text-slate-900 font-bold tracking-tight">
					¿Cómo obtener tus credenciales de Google?
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3 text-xs leading-relaxed text-slate-700">
				<div className="space-y-1">
					<p className="font-semibold text-slate-800">
						1.{" "}
						<a
							href="https://console.cloud.google.com"
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1 hover:text-primary hover:underline"
						>
							Google Cloud Console <ExternalLink size={12} />
						</a>
						:
					</p>
					<p>
						Crea un proyecto en{" "}
						<a
							href="https://console.cloud.google.com"
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
						>
							Google Cloud Console <ExternalLink size={11} />
						</a>
						, habilita la <strong>Google Classroom API</strong> y configura la
						pantalla de consentimiento OAuth.
					</p>
				</div>

				<div className="space-y-1">
					<p className="font-semibold text-slate-800">
						2. Client ID y Client Secret:
					</p>
					<p>
						Crea credenciales de tipo{" "}
						<strong>ID de cliente de OAuth 2.0</strong> (Tipo: Aplicación web).
						Copia el Client ID y el Client Secret generados.
					</p>
				</div>

				<div className="space-y-1">
					<p className="font-semibold text-slate-800">
						3. Google Refresh Token:
					</p>
					<p>
						Usa{" "}
						<a
							href="https://developers.google.com/oauthplayground"
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
						>
							OAuth 2.0 Playground <ExternalLink size={11} />
						</a>{" "}
						configurando tus credenciales OAuth. En{" "}
						<em>Input your own scopes</em>, autoriza los permisos requeridos
						listados en la tarjeta inferior.
					</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaGuiaGoogle;
