import { Check, Copy, ExternalLink, KeyRound } from "lucide-react";
import type React from "react";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../components/ui";
import { useCopiarTexto } from "../hooks/useCopiarTexto";

const TODOS_LOS_SCOPES = [
	"https://www.googleapis.com/auth/classroom.courses",
	"https://www.googleapis.com/auth/classroom.coursework.students",
	"https://www.googleapis.com/auth/classroom.rosters",
	"https://www.googleapis.com/auth/drive.readonly",
].join(" ");

export const TarjetaDocOAuthPlayground: React.FC = () => {
	const { copiadoId, copiar } = useCopiarTexto();
	const copiadoTodos = copiadoId === "unico";

	const copiarTodosLosScopes = () => copiar(TODOS_LOS_SCOPES);

	return (
		<Card className="flex flex-col h-full border-slate-200/80 bg-white">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base text-slate-900 font-bold tracking-tight">
					<KeyRound size={19} className="text-primary shrink-0" />
					<span>4. OAuth 2.0 Playground (Refresh Token)</span>
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col flex-1 justify-between space-y-4 text-xs text-slate-700 leading-relaxed">
				<ol className="list-decimal list-inside space-y-2.5">
					<li>
						En <strong>OAuth 2.0 Playground</strong>, haz clic en el engranaje
						de configuración, marca{" "}
						<strong>Use your own OAuth credentials</strong> y pega tu{" "}
						<strong>Client ID</strong> y <strong>Client Secret</strong>.
					</li>
					<li>
						<span>
							En <strong>Step 1</strong>, en el campo{" "}
							<em>Input your own scopes</em>, pega los 4 scopes juntos:
						</span>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={copiarTodosLosScopes}
							className="inline-flex h-6 px-2 text-[11px] align-middle ml-2"
						>
							{copiadoTodos ? (
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
					</li>
					<li>
						Presiona <strong>Authorize APIs</strong> e inicia sesión con la
						cuenta de Google institucional.
					</li>
					<li>
						En <strong>Step 2</strong>, haz clic en{" "}
						<strong>Exchange authorization code for tokens</strong> y copia el
						valor del campo <strong>Refresh token</strong> (comienza usualmente
						con <code>{"1//04..."}</code>).
					</li>
					<li>
						Pega las 3 credenciales en la pantalla de Configuración y haz clic
						en <strong>Guardar Configuración</strong>.
					</li>
				</ol>

				<div className="pt-2">
					<a
						href="https://developers.google.com/oauthplayground"
						target="_blank"
						rel="noreferrer"
						className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
					>
						<ExternalLink size={16} className="mr-2" />
						Ir a OAuth 2.0 Playground
					</a>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaDocOAuthPlayground;
