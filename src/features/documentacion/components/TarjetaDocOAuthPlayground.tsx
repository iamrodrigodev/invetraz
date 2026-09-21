import { Check, Copy, ExternalLink, KeyRound } from "lucide-react";
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
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-primary font-semibold text-sm">
						<KeyRound size={18} />
						<span>Token de Actualización</span>
					</div>
					<Badge variant="success" className="font-semibold text-xs">
						Paso 4
					</Badge>
				</div>
				<CardTitle className="text-base text-slate-900 font-bold tracking-tight">
					OAuth 2.0 Playground (Google Refresh Token)
				</CardTitle>
				<CardDescription>
					Genera el Refresh Token permanente que permite al backend consultar
					Classroom y Drive sin caducidad de sesión.
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col flex-1 justify-between space-y-4 text-xs text-slate-700 leading-relaxed">
				<div className="space-y-3">
					<div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-1">
						<p className="font-semibold text-slate-900">
							1. Configurar credenciales propias en el Playground
						</p>
						<p className="text-slate-600">
							Ingresa a OAuth 2.0 Playground y haz clic en el ícono de engranaje
							(⚙️ <em>OAuth 2.0 configuration</em>) en la esquina superior
							derecha. Marca <strong>Use your own OAuth credentials</strong> y
							pega tu <strong>OAuth Client ID</strong> y{" "}
							<strong>OAuth Client Secret</strong>.
						</p>
					</div>

					<div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-2">
						<div className="flex items-center justify-between">
							<p className="font-semibold text-slate-900">
								2. Autorizar los 4 scopes juntos
							</p>
							<button
								type="button"
								onClick={copiarTodosLosScopes}
								className={`inline-flex items-center gap-1 font-medium text-xs transition-colors cursor-pointer ${
									copiadoTodos
										? "text-primary font-semibold"
										: "text-slate-600 hover:text-primary active:scale-95"
								}`}
								title="Copiar los 4 scopes separados por espacio para pegar en Input your own scopes"
							>
								{copiadoTodos ? (
									<>
										<Check size={13} className="text-primary" />
										<span>¡Scopes copiados!</span>
									</>
								) : (
									<>
										<Copy size={13} className="text-slate-500" />
										<span>Copiar todos los scopes</span>
									</>
								)}
							</button>
						</div>
						<p className="text-slate-600">
							En <em>Step 1 - Select &amp; authorize APIs</em>, baja al campo{" "}
							<strong>Input your own scopes</strong> y pega la cadena con todos
							los scopes. Luego presiona el botón azul{" "}
							<strong>Authorize APIs</strong> e inicia sesión con la cuenta
							Google institucional.
						</p>
						<p className="font-mono text-[10px] bg-white border border-slate-200 rounded px-2 py-1 select-all break-all text-slate-800">
							{TODOS_LOS_SCOPES}
						</p>
					</div>

					<div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-1">
						<p className="font-semibold text-slate-900">
							3. Intercambiar código y copiar Refresh Token
						</p>
						<p className="text-slate-600">
							En <em>Step 2 - Exchange authorization code for tokens</em>, haz
							clic en el botón azul{" "}
							<strong>Exchange authorization code for tokens</strong>. Copia el
							valor generado en el campo <strong>Refresh token</strong>{" "}
							(comienza usualmente con <code>{"1//04..."}</code>).
						</p>
					</div>

					<div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-1">
						<p className="font-semibold text-slate-900">
							4. Guardar en el panel de Configuración
						</p>
						<p className="text-slate-600">
							Ingresa las 3 credenciales en el sistema y haz clic en{" "}
							<strong>Verificar Conexión</strong> para validar el acceso antes
							de guardar.
						</p>
					</div>
				</div>

				<div className="pt-2">
					<a
						href="https://developers.google.com/oauthplayground"
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
							Ir a OAuth 2.0 Playground
						</Button>
					</a>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaDocOAuthPlayground;
