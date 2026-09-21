import { Check, Copy, ExternalLink, KeyRound } from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../components/ui";

const TODOS_LOS_SCOPES = [
	"https://www.googleapis.com/auth/classroom.courses",
	"https://www.googleapis.com/auth/classroom.coursework.students",
	"https://www.googleapis.com/auth/classroom.rosters",
	"https://www.googleapis.com/auth/drive.readonly",
].join(" ");

export const TarjetaDocOAuthPlayground: React.FC = () => {
	const [copiadoTodos, setCopiadoTodos] = useState(false);

	const copiarTodosLosScopes = async () => {
		try {
			await navigator.clipboard.writeText(TODOS_LOS_SCOPES);
			setCopiadoTodos(true);
			setTimeout(() => setCopiadoTodos(false), 2000);
		} catch {
			const input = document.createElement("textarea");
			input.value = TODOS_LOS_SCOPES;
			document.body.appendChild(input);
			input.select();
			document.execCommand("copy");
			document.body.removeChild(input);
			setCopiadoTodos(true);
			setTimeout(() => setCopiadoTodos(false), 2000);
		}
	};

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
					<li className="space-y-1.5">
						<span>
							En <strong>Step 1</strong>, en el campo{" "}
							<em>Input your own scopes</em>, pega los 4 scopes juntos:
						</span>
						<div className="pt-1">
							<Button
								type="button"
								variant="default"
								onClick={copiarTodosLosScopes}
								className="w-full sm:w-auto font-medium"
							>
								{copiadoTodos ? (
									<>
										<Check size={16} className="mr-2" />
										<span>¡Scopes copiados!</span>
									</>
								) : (
									<>
										<Copy size={16} className="mr-2" />
										<span>Copiar todos los scopes juntos</span>
									</>
								)}
							</Button>
						</div>
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
						className="inline-block w-full sm:w-auto"
					>
						<Button
							type="button"
							variant="default"
							className="w-full sm:w-auto font-medium"
						>
							<ExternalLink size={16} className="mr-2" />
							Ir a OAuth 2.0 Playground
						</Button>
					</a>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaDocOAuthPlayground;
