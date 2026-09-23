// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { Skeleton } from "@/components/ui/Skeleton.tsx";

export function PlantillasSkeleton() {
	return (
		<div className="w-full space-y-6 pb-12">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<Skeleton className="h-8 w-72 rounded-lg" />
					<Skeleton className="mt-2 h-4 w-96 max-w-full rounded-md" />
				</div>
				<div className="flex items-center gap-3">
					<Skeleton className="h-9 w-32 rounded-lg" />
					<Skeleton className="h-9 w-48 rounded-lg" />
				</div>
			</div>

			<div className="w-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-3.5">
						<Skeleton className="h-7 w-7 rounded-lg" />
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Skeleton className="h-4 w-32 rounded-md" />
								<Skeleton className="h-5 w-44 rounded-full" />
							</div>
							<Skeleton className="h-3.5 w-48 rounded-md" />
						</div>
					</div>
					<Skeleton className="h-7 w-48 rounded-lg" />
				</div>
			</div>

			<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div
						key={i}
						className="space-y-4 rounded-2xl border border-slate-200/90 bg-white px-6 pt-6 pb-5 shadow-xs"
					>
						<div className="flex items-center justify-between">
							<Skeleton className="h-4 w-36 rounded-md" />
							<Skeleton className="h-5 w-32 rounded-full" />
						</div>
						<div className="space-y-3 border-slate-100 border-t pt-3">
							<div className="flex items-center justify-between">
								<Skeleton className="h-3.5 w-16 rounded-md" />
								<Skeleton className="h-3.5 w-14 rounded-md" />
							</div>
							<div className="flex items-center justify-between">
								<Skeleton className="h-3.5 w-20 rounded-md" />
								<Skeleton className="h-3.5 w-28 rounded-md" />
							</div>
							<div className="pt-2">
								<Skeleton className="h-9 w-full rounded-lg" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
