import { Check, Copy, ExternalLink, GraduationCap } from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../components/ui";

interface ScopeInfo {
	id: string;
	nombre: string;
	scope: string;
}

const SCOPES_CLASSROOM: ScopeInfo[] = [
	{
		id: "courses",
		nombre: "Cursos y Clases",
		scope: "https://www.googleapis.com/auth/classroom.courses",
	},
	{
		id: "coursework",
		nombre: "Tareas y Actividades",
		scope: "https://www.googleapis.com/auth/classroom.coursework.students",
	},
	{
		id: "rosters",
		nombre: "Estudiantes y Docentes",
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
				<CardTitle className="flex items-center gap-2 text-base text-slate-900 font-bold tracking-tight">
					<GraduationCap size={19} className="text-primary shrink-0" />
					<span>2. Google Classroom API</span>
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col flex-1 justify-between space-y-4 text-xs text-slate-700 leading-relaxed">
				<div className="space-y-3">
					<p>
						En Google Cloud, ve a{" "}
						<strong>APIs y servicios &gt; Biblioteca</strong>, busca{" "}
						<strong>Google Classroom API</strong> y haz clic en{" "}
						<strong>Habilitar</strong>.
					</p>

					<div className="space-y-2">
						<span className="font-semibold text-slate-900 block">
							Scopes requeridos para sincronizar aula:
						</span>
						{SCOPES_CLASSROOM.map((item) => {
							const estaCopiado = copiadoId === item.id;
							return (
								<div key={item.id} className="space-y-1">
									<div className="flex items-center justify-between">
										<span className="font-medium text-slate-800">
											{item.nombre}:
										</span>
										<Button
											type="button"
											variant="default"
											size="sm"
											onClick={() => copiarScope(item.scope, item.id)}
											className="h-6 px-2 text-[11px] shrink-0"
										>
											{estaCopiado ? (
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
									</div>
									<p className="font-mono text-[10.5px] bg-slate-50 border border-slate-200 rounded px-2 py-1 select-all break-all text-slate-800">
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
							variant="default"
							size="sm"
							className="w-full sm:w-auto"
						>
							<ExternalLink size={14} className="mr-1.5" />
							Habilitar Classroom API
						</Button>
					</a>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaDocClassroom;
