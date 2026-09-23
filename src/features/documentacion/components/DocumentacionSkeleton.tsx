// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { Skeleton } from "@/components/ui/Skeleton.tsx";

export function DocumentacionSkeleton() {
	return (
		<div className="w-full space-y-6 pb-12">
			<div>
				<div className="mb-1 flex items-center gap-2.5">
					<Skeleton className="h-6 w-6 rounded-md" />
					<Skeleton className="h-8 w-80 rounded-lg" />
				</div>
				<Skeleton className="mt-2 h-4 w-96 rounded-md" />
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="flex flex-col justify-between space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
					<div className="space-y-4">
						<div className="flex items-center gap-2 border-slate-100 border-b pb-3">
							<Skeleton className="h-5 w-5 rounded-md" />
							<Skeleton className="h-5 w-64 rounded-md" />
						</div>
						<div className="space-y-3 pt-1">
							<Skeleton className="h-3.5 w-4/5 rounded-md" />
							<Skeleton className="h-3.5 w-11/12 rounded-md" />
							<Skeleton className="h-3.5 w-3/4 rounded-md" />
							<div className="space-y-1.5">
								<Skeleton className="h-3.5 w-2/3 rounded-md" />
								<div className="mt-1 flex items-center gap-2">
									<Skeleton className="h-8 flex-1 rounded-md" />
									<Skeleton className="h-8 w-20 shrink-0 rounded-md" />
								</div>
							</div>
							<Skeleton className="h-3.5 w-4/5 rounded-md" />
						</div>
					</div>
					<div className="pt-2">
						<Skeleton className="h-9 w-56 rounded-lg" />
					</div>
				</div>

				<div className="flex flex-col justify-between space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
					<div className="space-y-4">
						<div className="flex items-center gap-2 border-slate-100 border-b pb-3">
							<Skeleton className="h-5 w-5 rounded-md" />
							<Skeleton className="h-5 w-52 rounded-md" />
						</div>
						<div className="space-y-3 pt-1">
							<Skeleton className="h-3.5 w-11/12 rounded-md" />
							<Skeleton className="h-4 w-52 rounded-md" />
							<div className="space-y-2.5">
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<Skeleton className="h-3.5 w-28 rounded-md" />
										<Skeleton className="h-6 w-16 rounded-md" />
									</div>
									<Skeleton className="h-7 w-full rounded-md" />
								</div>
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<Skeleton className="h-3.5 w-36 rounded-md" />
										<Skeleton className="h-6 w-16 rounded-md" />
									</div>
									<Skeleton className="h-7 w-full rounded-md" />
								</div>
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<Skeleton className="h-3.5 w-40 rounded-md" />
										<Skeleton className="h-6 w-16 rounded-md" />
									</div>
									<Skeleton className="h-7 w-full rounded-md" />
								</div>
							</div>
						</div>
					</div>
					<div className="pt-2">
						<Skeleton className="h-9 w-52 rounded-lg" />
					</div>
				</div>

				<div className="flex flex-col justify-between space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
					<div className="space-y-4">
						<div className="flex items-center gap-2 border-slate-100 border-b pb-3">
							<Skeleton className="h-5 w-5 rounded-md" />
							<Skeleton className="h-5 w-44 rounded-md" />
						</div>
						<div className="space-y-3 pt-1">
							<Skeleton className="h-3.5 w-11/12 rounded-md" />
							<Skeleton className="h-3.5 w-full rounded-md" />
							<div className="space-y-1.5">
								<Skeleton className="h-3.5 w-48 rounded-md" />
								<div className="mt-1 flex items-center gap-2">
									<Skeleton className="h-8 flex-1 rounded-md" />
									<Skeleton className="h-8 w-20 shrink-0 rounded-md" />
								</div>
							</div>
							<Skeleton className="h-3.5 w-5/6 rounded-md" />
						</div>
					</div>
					<div className="pt-2">
						<Skeleton className="h-9 w-44 rounded-lg" />
					</div>
				</div>

				<div className="flex flex-col justify-between space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
					<div className="space-y-4">
						<div className="flex items-center gap-2 border-slate-100 border-b pb-3">
							<Skeleton className="h-5 w-5 rounded-md" />
							<Skeleton className="h-5 w-64 rounded-md" />
						</div>
						<div className="space-y-3 pt-1">
							<Skeleton className="h-3.5 w-full rounded-md" />
							<div className="flex items-center justify-between gap-2">
								<Skeleton className="h-3.5 w-3/4 rounded-md" />
								<Skeleton className="h-6 w-16 shrink-0 rounded-md" />
							</div>
							<Skeleton className="h-3.5 w-4/5 rounded-md" />
							<Skeleton className="h-3.5 w-full rounded-md" />
							<Skeleton className="h-3.5 w-3/4 rounded-md" />
						</div>
					</div>
					<div className="pt-2">
						<Skeleton className="h-9 w-52 rounded-lg" />
					</div>
				</div>
			</div>
		</div>
	);
}
