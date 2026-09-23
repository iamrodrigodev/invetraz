// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { Skeleton } from "@/components/ui/Skeleton.tsx";

export function ConfiguracionSkeleton() {
	return (
		<div className="space-y-6">
			<div>
				<Skeleton className="h-8 w-72 rounded-lg" />
				<Skeleton className="mt-2 h-4 w-96 rounded-md" />
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
					<div>
						<div className="border-slate-100 border-b pb-5">
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<Skeleton className="h-5 w-44 rounded-md" />
								<Skeleton className="h-6 w-36 rounded-full" />
							</div>
							<Skeleton className="mt-3 h-6 w-56 rounded-md" />
							<Skeleton className="mt-1.5 h-4 w-80 rounded-md" />
						</div>
						<div className="space-y-5 pt-5">
							<div className="space-y-1.5">
								<Skeleton className="h-4 w-28 rounded-md" />
								<Skeleton className="h-10 w-full rounded-lg" />
								<Skeleton className="h-3.5 w-64 rounded-md" />
							</div>
							<div className="space-y-1.5">
								<Skeleton className="h-4 w-36 rounded-md" />
								<Skeleton className="h-10 w-full rounded-lg" />
								<Skeleton className="h-3.5 w-52 rounded-md" />
							</div>
							<div className="space-y-1.5">
								<Skeleton className="h-4 w-36 rounded-md" />
								<Skeleton className="h-10 w-full rounded-lg" />
								<Skeleton className="h-3.5 w-56 rounded-md" />
							</div>
						</div>
					</div>
					<div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:items-center sm:justify-end">
						<Skeleton className="h-10 w-full rounded-lg sm:w-36" />
						<Skeleton className="h-10 w-full rounded-lg sm:w-44" />
					</div>
				</div>

				<div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xs">
					<div className="space-y-2 p-6 pb-4">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-5 shrink-0 rounded-md" />
								<Skeleton className="h-5 w-64 max-w-full rounded-md" />
							</div>
							<Skeleton className="h-6 w-36 rounded-full" />
						</div>
						<Skeleton className="h-3.5 w-full rounded-md" />
						<Skeleton className="h-3.5 w-4/5 rounded-md" />
					</div>

					<div className="flex flex-1 flex-col space-y-5 p-6 pt-0">
						<div className="space-y-2 rounded-lg border border-slate-200 p-3.5">
							<Skeleton className="h-4 w-full rounded-md" />
							<Skeleton className="h-4 w-4/5 rounded-md" />
						</div>

						<div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 p-3.5 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex min-w-0 items-center gap-3">
								<Skeleton className="h-6 w-6 shrink-0 rounded-md" />
								<div className="min-w-0 space-y-2">
									<div className="flex flex-wrap items-center gap-2">
										<Skeleton className="h-4 w-32 rounded-md" />
										<Skeleton className="h-5 w-24 rounded-full" />
									</div>
									<Skeleton className="h-3 w-44 max-w-full rounded-md" />
								</div>
							</div>
							<Skeleton className="h-10 w-full rounded-lg sm:w-36" />
						</div>

						<div className="flex flex-1 flex-col justify-between space-y-5">
							<div className="space-y-1.5">
								<Skeleton className="h-4 w-64 max-w-full rounded-md" />
								<Skeleton className="h-3.5 w-full rounded-md" />
								<Skeleton className="h-3.5 w-4/5 rounded-md" />
								<Skeleton className="h-10 w-full rounded-lg" />
								<Skeleton className="ml-auto h-3 w-12 rounded-md" />
							</div>
							<div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-end">
								<Skeleton className="h-10 w-full rounded-lg sm:w-44" />
								<Skeleton className="h-10 w-full rounded-lg sm:w-48" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
