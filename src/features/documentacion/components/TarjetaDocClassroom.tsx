import { Check, Copy, ExternalLink, GraduationCap } from "lucide-react";
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

interface ScopeInfo {
	id: string;
	nombre: string;
	descripcion: string;
	scope: string;
}

const SCOPES_CLASSROOM: ScopeInfo[] = [
	{
		id: "courses",
		nombre: "Cursos y Clases",
		descripcion: "Lectura de materias, cursos creados y metadatos de aula",
		scope: "https://www.googleapis.com/auth/classroom.courses",
	},
	{
		id: "coursework",
		nombre: "Tareas y Actividades",
		descripcion: "Lectura de trabajos asignados, estados y entregas de alumnos",
		scope: "https://www.googleapis.com/auth/classroom.coursework.students",
	},
	{
		id: "rosters",
		nombre: "Listas de Alumnos y Docentes",
		descripcion:
			"Lectura de profesores y estudiantes matriculados en cada curso",
		scope: "https://www.googleapis.com/auth/classroom.rosters",
	},
];

export const TarjetaDocClassroom: React.FC = () => {
	const [copiadoId, setCopiadoId] = useState<string | null>(null);

	const copiarScope = async (scope: string, id: string) => {
		try {
			await navigator.clipboard.writeText(scope);
			setCopiadoId(id);
			setTimeout(() => setCopiadoId(null), 2000);
		} catch {
			const input = document.createElement("textarea");
			input.value = scope;
			document.body.appendChild(input);
			input.select();
			document.execCommand("copy");
			document.body.removeChild(input);
			setCopiadoId(id);
			setTimeout(() => setCopiadoId(null), 2000);
		}
	};

	return (
		<Card className="flex flex-col h-full border-slate-200/80 bg-white">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-primary font-semibold text-sm">
						<GraduationCap size={18} />
						<span>Google Classroom</span>
					</div>
					<Badge variant="primary" className="font-semibold text-xs">
						Paso 2
					</Badge>
				</div>
				<CardTitle className="text-base text-slate-900 font-bold tracking-tight">
					Google Classroom API y Permisos
				</CardTitle>
				<CardDescription>
					Habilita la API de Classroom y autoriza los alcances de lectura
					necesarios para la sincronización académica.
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col flex-1 justify-between space-y-4 text-xs text-slate-700 leading-relaxed">
				<div className="space-y-3">
					<div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-1">
						<p className="font-semibold text-slate-900">
							1. Habilitar Classroom API en Google Cloud
						</p>
						<p className="text-slate-600">
							En tu proyecto de Google Cloud, ingresa a{" "}
							<em>APIs y servicios &gt; Biblioteca</em>, busca{" "}
							<strong>Google Classroom API</strong> y haz clic en{" "}
							<strong>Habilitar</strong>.
						</p>
					</div>

					<div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-1">
						<p className="font-semibold text-slate-900">
							2. Función en el Sistema de Investigación
						</p>
						<p className="text-slate-600">
							Permite importar cursos institucionales en tiempo real, rastrear
							entregas de estudiantes y asociar revisiones de seguimiento a las
							actividades oficiales.
						</p>
					</div>

					<div className="space-y-2">
						<span className="font-semibold text-slate-900 block text-xs">
							3. Scopes requeridos de Google Classroom:
						</span>
						{SCOPES_CLASSROOM.map((item) => {
							const estaCopiado = copiadoId === item.id;
							return (
								<div
									key={item.id}
									className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 space-y-1.5"
								>
									<div className="flex items-center justify-between">
										<div>
											<span className="font-semibold text-slate-900">
												{item.nombre}
											</span>
											<span className="text-slate-500 text-[11px] block">
												{item.descripcion}
											</span>
										</div>
										<button
											type="button"
											onClick={() => copiarScope(item.scope, item.id)}
											className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer font-medium text-[11px] shrink-0"
										>
											{estaCopiado ? (
												<>
													<Check size={12} />
													<span>Copiado</span>
												</>
											) : (
												<>
													<Copy size={12} />
													<span>Copiar</span>
												</>
											)}
										</button>
									</div>
									<p className="font-mono text-[10.5px] bg-white border border-slate-200 rounded px-2 py-1 select-all break-all text-slate-800">
										{item.scope}
									</p>
								</div>
							);
						})}
					</div>
				</div>

				<div className="pt-2">
					<a
						href="https://console.cloud.google.com/apis/library/classroom.googleapis.com"
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
							Habilitar Classroom API en Google Cloud
						</Button>
					</a>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaDocClassroom;
