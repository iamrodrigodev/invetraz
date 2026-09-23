// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { Skeleton } from "@/components/ui/Skeleton.tsx";

export function ActividadesSeguimientoSkeleton() {
	return (
		<div className="flex min-h-full w-full flex-1 flex-col">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
				<div className="min-w-0 space-y-2">
					<Skeleton className="h-8 w-72 rounded-lg" />
					<Skeleton className="h-4 w-96 max-w-full rounded-md" />
				</div>

				<div className="flex w-full shrink-0 flex-col-reverse gap-3 sm:w-auto sm:flex-row sm:items-center lg:pt-1">
					<Skeleton className="h-10 w-28 rounded-lg" />
				</div>
			</div>

			<div className="mt-5 w-full rounded-2xl border-2 border-slate-200 border-dashed bg-slate-50/50 py-12 text-center">
				<div className="mx-auto flex max-w-sm flex-col items-center justify-center space-y-3 px-4">
					<Skeleton className="h-7 w-7 rounded-md" />
					<div className="flex w-full flex-col items-center space-y-2">
						<Skeleton className="h-4 w-60 rounded-md" />
						<Skeleton className="h-3.5 w-72 max-w-full rounded-md" />
						<Skeleton className="h-3.5 w-56 max-w-full rounded-md" />
					</div>
					<Skeleton className="mt-2 h-10 w-36 rounded-lg" />
				</div>
			</div>
		</div>
	);
}
