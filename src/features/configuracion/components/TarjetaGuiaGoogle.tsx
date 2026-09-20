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
						con tus credenciales. En <em>Input your own scopes</em> autoriza los permisos necesarios para la sincronización:
					</p>

					{/* Contenedor compacto de scopes con diseño integrado y colores de la app */}
					<div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-xs">
						<div className="mb-1.5 flex items-center justify-between border-b border-slate-100 pb-1.5">
							<span className="text-[11px] font-semibold text-slate-700">
								Scopes de Classroom
							</span>
							<button
								type="button"
								onClick={() =>
									copiarTexto(
										SCOPES_DISPONIBLES.map((s) => s.scope).join(" "),
										"todos",
									)
								}
								className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium transition-all cursor-pointer ${
									copiadoId === "todos"
										? "bg-primary-50 text-primary font-semibold"
										: "text-slate-600 hover:bg-slate-100 hover:text-primary active:scale-95"
								}`}
								title="Copiar todos los scopes separados por espacio"
							>
								{copiadoId === "todos" ? (
									<>
										<Check size={11} className="text-primary" />
										<span>¡Copiados!</span>
									</>
								) : (
									<>
										<Copy size={11} className="text-slate-400" />
										<span>Copiar todos</span>
									</>
								)}
							</button>
						</div>

						<div className="space-y-1">
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
										className={`group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[11px] transition-all cursor-pointer select-none ${
											estaCopiado
												? "bg-primary-50 text-primary font-medium"
												: "hover:bg-slate-50 text-slate-600"
										}`}
										title={`Clic para copiar scope de ${item.nombre}`}
									>
										<div className="flex items-center gap-1.5 min-w-0">
											<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
											<span className="font-mono text-[10px] truncate text-slate-600 group-hover:text-slate-900">
												{item.scope}
											</span>
										</div>
										<span className="shrink-0 flex items-center gap-1 text-[10px]">
											{estaCopiado ? (
												<>
													<Check size={11} className="text-primary" />
													<span className="font-semibold text-primary">Copiado</span>
												</>
											) : (
												<Copy
													size={10}
													className="text-slate-300 transition-colors group-hover:text-primary"
												/>
											)}
										</span>
									</div>
								);
							})}
						</div>

						<p className="mt-2 border-t border-slate-100 pt-2 text-[10px] text-slate-500 leading-normal">
							No se limita solo a cursos: puedes agregar tareas (<code className="rounded bg-slate-100 px-1 py-0.5 text-[9px] text-slate-700">coursework</code>) o participantes (<code className="rounded bg-slate-100 px-1 py-0.5 text-[9px] text-slate-700">rosters</code>) según lo que requiera el sistema.
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
