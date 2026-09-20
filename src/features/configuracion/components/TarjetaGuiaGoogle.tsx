import { Check, Copy, ExternalLink, Info } from "lucide-react";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";

interface ScopeClassroom {
	id: string;
	nombre: string;
	scope: string;
	descripcion: string;
}

const SCOPES_DISPONIBLES: ScopeClassroom[] = [
	{
		id: "courses",
		nombre: "Cursos y clases (básico)",
		scope: "https://www.googleapis.com/auth/classroom.courses",
		descripcion: "Lectura y sincronización de cursos activos.",
	},
	{
		id: "coursework",
		nombre: "Tareas y actividades",
		scope: "https://www.googleapis.com/auth/classroom.coursework.students",
		descripcion: "Seguimiento y creación de tareas y entregas.",
	},
	{
		id: "rosters",
		nombre: "Estudiantes y docentes",
		scope: "https://www.googleapis.com/auth/classroom.rosters",
		descripcion: "Consulta de participantes en cada aula.",
	},
];

export const TarjetaGuiaGoogle: React.FC = () => {
	const [copiadoId, setCopiadoId] = useState<string | null>(null);

	const copiarTexto = async (texto: string, id: string) => {
		try {
			await navigator.clipboard.writeText(texto);
			setCopiadoId(id);
			setTimeout(() => setCopiadoId(null), 2000);
		} catch {
			// Fallback en navegadores con permisos restringidos
			const input = document.createElement("textarea");
			input.value = texto;
			document.body.appendChild(input);
			input.select();
			document.execCommand("copy");
			document.body.removeChild(input);
			setCopiadoId(id);
			setTimeout(() => setCopiadoId(null), 2000);
		}
	};

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
			<CardContent className="space-y-3.5 text-xs leading-relaxed text-slate-600">
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
						</a>:
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

				<div className="space-y-1">
					<p className="font-semibold text-slate-800">
						2. Client ID y Client Secret:
					</p>
					<p>
						Crea credenciales de tipo <strong>ID de cliente de OAuth 2.0</strong> (Tipo: Aplicación web). Copia el Client ID y el Client Secret.
					</p>
				</div>

				<div className="space-y-2">
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
						con tus credenciales. No te limites solo a cursos; en <em>Input your own scopes</em> puedes autorizar los permisos que requiera el sistema:
					</p>

					{/* Lista interactiva de scopes copiables */}
					<div className="space-y-1.5 pt-1">
						{SCOPES_DISPONIBLES.map((item) => {
							const estaCopiado = copiadoId === item.id;
							return (
								<div
									key={item.id}
									onClick={() => copiarTexto(item.scope, item.id)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											copiarTexto(item.scope, item.id);
										}
									}}
									role="button"
									tabIndex={0}
									className={`group relative flex flex-col gap-0.5 rounded-lg border p-2 text-[11px] transition-all cursor-pointer select-none ${
										estaCopiado
											? "border-emerald-400 bg-emerald-50/80 text-emerald-950 shadow-xs"
											: "border-slate-200 bg-white hover:border-primary/50 hover:bg-slate-50/90 text-slate-700"
									}`}
									title="Haz clic para copiar este scope"
								>
									<div className="flex items-center justify-between font-medium">
										<span className="font-semibold text-slate-800">
											{item.nombre}
										</span>
										<span className="flex items-center gap-1 text-[10px]">
											{estaCopiado ? (
												<>
													<Check size={12} className="text-emerald-600" />
													<span className="font-semibold text-emerald-700">
														¡Copiado!
													</span>
												</>
											) : (
												<>
													<Copy
														size={11}
														className="text-slate-400 transition-colors group-hover:text-primary"
													/>
													<span className="text-slate-400 transition-colors group-hover:text-primary">
														Copiar
													</span>
												</>
											)}
										</span>
									</div>
									<code className="break-all font-mono text-[10px] text-slate-500 group-hover:text-slate-800">
										{item.scope}
									</code>
								</div>
							);
						})}
					</div>

					{/* Botón para copiar todos los scopes juntos */}
					<div className="pt-1">
						<button
							type="button"
							onClick={() =>
								copiarTexto(
									SCOPES_DISPONIBLES.map((s) => s.scope).join(" "),
									"todos",
								)
							}
							className={`w-full inline-flex items-center justify-center gap-1.5 rounded-lg border py-1.5 px-2.5 text-[11px] font-medium transition-all cursor-pointer ${
								copiadoId === "todos"
									? "border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold shadow-xs"
									: "border-slate-200 bg-white text-slate-700 hover:border-primary/40 hover:bg-primary-50/30 hover:text-primary"
							}`}
						>
							{copiadoId === "todos" ? (
								<>
									<Check size={13} className="text-emerald-600" />
									<span>¡Todos los scopes copiados!</span>
								</>
							) : (
								<>
									<Copy size={12} />
									<span>Copiar todos los scopes (separados por espacio)</span>
								</>
							)}
						</button>
						<p className="mt-1 text-[10px] text-slate-400 text-center">
							Pégalos en OAuth 2.0 Playground para autorizar la integración completa.
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
