import { Check, Copy, KeyRound } from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../../components/ui/Card";

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

export const TarjetaScopesGoogle: React.FC = () => {
	const [copiadoId, setCopiadoId] = useState<string | null>(null);

	const copiarTexto = async (texto: string, id: string) => {
		try {
			await navigator.clipboard.writeText(texto);
			setCopiadoId(id);
			setTimeout(() => setCopiadoId(null), 2000);
		} catch {
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
		<Card className="border-slate-200/80 bg-white">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-primary font-medium text-sm">
						<KeyRound size={16} />
						<span>Permisos OAuth 2.0</span>
					</div>
					<button
						type="button"
						onClick={() =>
							copiarTexto(
								SCOPES_DISPONIBLES.map((s) => s.scope).join(" "),
								"todos",
							)
						}
						className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
							copiadoId === "todos"
								? "border-primary/30 bg-primary-50 text-primary font-semibold"
								: "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-primary active:scale-95"
						}`}
						title="Copiar todos los scopes separados por espacio"
					>
						{copiadoId === "todos" ? (
							<>
								<Check size={12} className="text-primary" />
								<span>¡Copiados!</span>
							</>
						) : (
							<>
								<Copy size={12} className="text-slate-500" />
								<span>Copiar todos</span>
							</>
						)}
					</button>
				</div>
				<CardTitle className="text-base text-slate-900 font-bold">
					Scopes de Classroom
				</CardTitle>
				<CardDescription className="text-xs text-slate-500">
					Permisos para ingresar en <em>Input your own scopes</em> en OAuth 2.0
					Playground.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3 text-xs leading-relaxed text-slate-600">
				<div className="space-y-1">
					{SCOPES_DISPONIBLES.map((item) => {
						const estaCopiado = copiadoId === item.id;
						return (
							<button
								key={item.id}
								type="button"
								onClick={() => copiarTexto(item.scope, item.id)}
								className={`group flex w-full items-center justify-between gap-2 rounded-xl p-2.5 text-left transition-all cursor-pointer select-none ${
									estaCopiado
										? "bg-primary-50 text-primary font-medium shadow-2xs"
										: "hover:bg-slate-50 text-slate-700"
								}`}
								title={`Clic para copiar scope de ${item.nombre}`}
							>
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<span
											className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
												estaCopiado
													? "bg-primary"
													: "bg-slate-400 group-hover:bg-primary"
											}`}
										/>
										<span className="font-semibold text-slate-900 text-xs">
											{item.nombre}
										</span>
									</div>
									<p className="mt-0.5 pl-3.5 font-mono text-[11px] text-slate-500 truncate group-hover:text-slate-700">
										{item.scope}
									</p>
								</div>
								<div className="shrink-0 flex items-center gap-1 pl-2 text-xs">
									{estaCopiado ? (
										<>
											<Check size={13} className="text-primary" />
											<span className="font-bold text-primary text-[11px]">
												Copiado
											</span>
										</>
									) : (
										<Copy
											size={13}
											className="text-slate-400 transition-colors group-hover:text-primary"
										/>
									)}
								</div>
							</button>
						);
					})}
				</div>

				<p className="border-t border-slate-100 pt-2 text-[11px] text-slate-500 leading-normal">
					No se limita solo a cursos: puedes agregar tareas (
					<code className="rounded bg-slate-100 px-1 py-0.5 text-[10px] font-mono text-slate-700">
						coursework
					</code>
					) o participantes (
					<code className="rounded bg-slate-100 px-1 py-0.5 text-[10px] font-mono text-slate-700">
						rosters
					</code>
					) según las funciones que requiera el sistema.
				</p>
			</CardContent>
		</Card>
	);
};

export default TarjetaScopesGoogle;
