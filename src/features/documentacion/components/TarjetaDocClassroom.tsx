// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { Check, Copy, ExternalLink, GraduationCap } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/Button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.tsx";
import { useCopiarTexto } from "@/features/documentacion/hooks/useCopiarTexto.ts";

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
	const { copiadoId, copiar: copiarScope } = useCopiarTexto();

	return (
		<Card className="flex h-full flex-col border-slate-200/80 bg-white">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 font-bold text-base text-slate-900 tracking-tight">
					<GraduationCap size={19} className="shrink-0 text-primary" />
					<span>2. Google Classroom API</span>
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col justify-between space-y-4 text-slate-700 text-xs leading-relaxed">
				<div className="space-y-3">
					<p>
						En Google Cloud, ve a <strong>APIs y servicios &gt; Biblioteca</strong>, busca{" "}
						<strong>Google Classroom API</strong> y haz clic en <strong>Habilitar</strong>.
					</p>

					<div className="space-y-2">
						<span className="block font-semibold text-slate-900">
							Scopes requeridos para sincronizar aula:
						</span>
						{SCOPES_CLASSROOM.map((item) => {
							const estaCopiado = copiadoId === item.id;
							return (
								<div key={item.id} className="space-y-1">
									<div className="flex items-center justify-between">
										<span className="font-medium text-slate-800">{item.nombre}:</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => copiarScope(item.scope, item.id)}
											className="h-6 shrink-0 px-2 text-[11px]"
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
									<p className="select-all break-all rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[10.5px] text-slate-800">
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
						className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
					>
						<ExternalLink size={16} className="mr-2" />
						Habilitar Classroom API
					</a>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaDocClassroom;
