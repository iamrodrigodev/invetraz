// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { Check, Copy, ExternalLink, KeyRound } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/Button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.tsx";
import { useCopiarTexto } from "@/features/documentacion/hooks/useCopiarTexto.ts";

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
		<Card className="flex h-full flex-col border-slate-200/80 bg-white">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 font-bold text-base text-slate-900 tracking-tight">
					<KeyRound size={19} className="shrink-0 text-primary" />
					<span>4. OAuth 2.0 Playground (Refresh Token)</span>
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col justify-between space-y-4 text-slate-700 text-xs leading-relaxed">
				<ol className="list-inside list-decimal space-y-2.5">
					<li>
						En <strong>OAuth 2.0 Playground</strong>, haz clic en el engranaje de configuración,
						marca <strong>Use your own OAuth credentials</strong> y pega tu{" "}
						<strong>Client ID</strong> y <strong>Client Secret</strong>.
					</li>
					<li>
						<span>
							En <strong>Step 1</strong>, en el campo <em>Input your own scopes</em>, pega los 4
							scopes juntos:
						</span>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={copiarTodosLosScopes}
							className="ml-2 inline-flex h-6 px-2 align-middle text-[11px]"
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
						Presiona <strong>Authorize APIs</strong> e inicia sesión con la cuenta de Google
						institucional.
					</li>
					<li>
						En <strong>Step 2</strong>, haz clic en{" "}
						<strong>Exchange authorization code for tokens</strong> y copia el valor del campo{" "}
						<strong>Refresh token</strong> (comienza usualmente con <code>1{/* 04... */}</code>).
					</li>
					<li>
						Pega las 3 credenciales en la pantalla de Configuración y haz clic en{" "}
						<strong>Guardar Configuración</strong>.
					</li>
				</ol>

				<div className="pt-2">
					<a
						href="https://developers.google.com/oauthplayground"
						target="_blank"
						rel="noreferrer"
						className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
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
