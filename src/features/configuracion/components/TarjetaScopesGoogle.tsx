import { Check, Copy, KeyRound } from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../components/ui/Card";

interface ScopeClassroom {
	id: string;
	nombre: string;
	scope: string;
}

const SCOPES_DISPONIBLES: ScopeClassroom[] = [
	{
		id: "courses",
		nombre: "1. Cursos y clases",
		scope: "https://www.googleapis.com/auth/classroom.courses",
	},
	{
		id: "coursework",
		nombre: "2. Tareas y actividades",
		scope: "https://www.googleapis.com/auth/classroom.coursework.students",
	},
	{
		id: "rosters",
		nombre: "3. Estudiantes y docentes",
		scope: "https://www.googleapis.com/auth/classroom.rosters",
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
					<div className="flex items-center gap-2 text-primary font-semibold text-sm">
						<KeyRound size={16} />
						<span>Permisos de sincronización</span>
					</div>
					<button
						type="button"
						onClick={() =>
							copiarTexto(
								SCOPES_DISPONIBLES.map((s) => s.scope).join(" "),
								"todos",
							)
						}
						className={`inline-flex items-center gap-1 font-medium text-xs transition-colors cursor-pointer ${
							copiadoId === "todos"
								? "text-primary font-semibold"
								: "text-slate-600 hover:text-primary active:scale-95"
						}`}
						title="Copiar todos los scopes separados por espacio"
					>
						{copiadoId === "todos" ? (
							<>
								<Check size={13} className="text-primary" />
								<span>¡Copiados!</span>
							</>
						) : (
							<>
								<Copy size={13} className="text-slate-500" />
								<span>Copiar todos</span>
							</>
						)}
					</button>
				</div>
				<CardTitle className="text-base text-slate-900 font-bold tracking-tight">
					Scopes de Google Classroom
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2.5 text-xs leading-relaxed text-slate-700">
				{SCOPES_DISPONIBLES.map((item) => {
					const estaCopiado = copiadoId === item.id;
					return (
						<div key={item.id} className="space-y-1">
							<div className="flex items-center justify-between">
								<span className="font-semibold text-slate-800">
									{item.nombre}:
								</span>
								<button
									type="button"
									onClick={() => copiarTexto(item.scope, item.id)}
									className={`inline-flex items-center gap-1 font-medium text-[11px] transition-colors cursor-pointer ${
										estaCopiado
											? "text-primary font-semibold"
											: "text-slate-500 hover:text-primary"
									}`}
									title={`Copiar ${item.nombre}`}
								>
									{estaCopiado ? (
										<>
											<Check size={12} className="text-primary" />
											<span>Copiado</span>
										</>
									) : (
										<>
											<Copy size={12} className="text-slate-400" />
											<span>Copiar</span>
										</>
									)}
								</button>
							</div>
							<p className="font-mono text-[11px] text-slate-800 bg-slate-50 rounded-md px-2.5 py-1 border border-slate-200/70 select-all break-all">
								{item.scope}
							</p>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
};

export default TarjetaScopesGoogle;
