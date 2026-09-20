import { ExternalLink, Info, ShieldCheck } from "lucide-react";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";

export const TarjetaGuiaGoogle: React.FC = () => {
	return (
		<Card className="border-slate-200/80 bg-slate-50/50">
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2 text-primary font-medium text-sm">
					<Info size={16} />
					<span>Guía rápida de integración</span>
				</div>
				<CardTitle className="text-base text-slate-900 font-bold">
					¿Cómo obtener tus credenciales de Google?
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3 text-xs leading-relaxed text-slate-600">
				<div className="space-y-1.5">
					<p className="font-semibold text-slate-800">
						1. Google Cloud Console:
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
						, habilita la <strong>Google Classroom API</strong> y configura la pantalla de consentimiento OAuth.
					</p>
				</div>

				<div className="space-y-1.5">
					<p className="font-semibold text-slate-800">
						2. Client ID y Client Secret:
					</p>
					<p>
						Crea credenciales de tipo <strong>ID de cliente de OAuth 2.0</strong> (Tipo: Aplicación web). Copia el Client ID y el Client Secret.
					</p>
				</div>

				<div className="space-y-1.5">
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
						con tus credenciales y el scope{" "}
						<code className="rounded bg-slate-200 px-1 py-0.5 text-[11px] text-slate-800">
							https://www.googleapis.com/auth/classroom.courses
						</code>{" "}
						para autorizar y generar el Refresh Token permanente.
					</p>
				</div>

				<div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary-50/50 p-3 text-primary-950">
					<ShieldCheck size={16} className="mt-0.5 shrink-0 text-primary" />
					<p className="text-[11px] leading-normal text-slate-700">
						<strong>Seguridad garantizada:</strong> El Client Secret y el Refresh Token se almacenan de forma cifrada mediante el algoritmo <strong>AES-256</strong> en la base de datos del sistema.
					</p>
				</div>
			</CardContent>
		</Card>
	);
};
