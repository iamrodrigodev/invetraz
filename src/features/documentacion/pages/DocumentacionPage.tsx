// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { BookOpen } from "lucide-react";
import type React from "react";
import { TarjetaDocClassroom } from "@/features/documentacion/components/TarjetaDocClassroom.tsx";
import { TarjetaDocDrive } from "@/features/documentacion/components/TarjetaDocDrive.tsx";
import { TarjetaDocGoogleCloud } from "@/features/documentacion/components/TarjetaDocGoogleCloud.tsx";
import { TarjetaDocOAuthPlayground } from "@/features/documentacion/components/TarjetaDocOAuthPlayground.tsx";

export const DocumentacionPage: React.FC = () => (
	<div className="w-full space-y-6 pb-12">
		<div>
			<div className="mb-1 flex items-center gap-2.5 text-primary">
				<BookOpen size={22} className="shrink-0" />
				<h1 className="font-extrabold font-heading text-2xl text-slate-900 tracking-tight sm:text-3xl">
					Documentación de Integración
				</h1>
			</div>
			<p className="mt-1 text-slate-600 text-sm">
				Guía y referencia técnica de credenciales OAuth 2.0 y permisos requeridos para la
				sincronización con Google Classroom y Google Drive.
			</p>
		</div>

		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<TarjetaDocGoogleCloud />
			<TarjetaDocClassroom />
			<TarjetaDocDrive />
			<TarjetaDocOAuthPlayground />
		</div>
	</div>
);

export default DocumentacionPage;
