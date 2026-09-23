// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { Skeleton } from "@/components/ui/Skeleton.tsx";
import { cn } from "@/utils/cn.ts";

export interface ModuloEnConstruccionSkeletonProps {
	tituloAncho: string;
}

export function ModuloEnConstruccionSkeleton({ tituloAncho }: ModuloEnConstruccionSkeletonProps) {
	return (
		<div
			className="flex h-full min-h-[450px] w-full flex-1 flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-white p-8 text-center shadow-xs md:p-12"
			role="status"
			aria-busy="true"
			aria-label="Cargando contenido..."
		>
			<Skeleton className="mb-6 h-14 w-14 rounded-xl" />
			<Skeleton className={cn("mb-2 h-8 max-w-full rounded-lg md:h-9", tituloAncho)} />
			<div className="flex w-full max-w-md flex-col items-center gap-2">
				<Skeleton className="h-4 w-full rounded-md" />
				<Skeleton className="h-4 w-11/12 rounded-md" />
				<Skeleton className="h-4 w-2/3 rounded-md" />
			</div>
		</div>
	);
}
