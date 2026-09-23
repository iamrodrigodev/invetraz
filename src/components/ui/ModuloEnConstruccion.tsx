// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { Hammer, type LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn.ts";

export interface ModuloEnConstruccionProps {
	titulo: string;
	descripcion?: string;
	icono?: LucideIcon;
	className?: string;
}

export function ModuloEnConstruccion({
	titulo,
	descripcion = "Estamos trabajando arduamente en este módulo. Muy pronto podrás disfrutar de todas sus funcionalidades. ¡Gracias por tu paciencia!",
	icono: Icono = Hammer,
	className,
}: ModuloEnConstruccionProps) {
	return (
		<div
			className={cn(
				"flex h-full min-h-[450px] w-full flex-1 flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-white p-8 text-center shadow-xs md:p-12",
				className,
			)}
		>
			<Icono className="mb-6 h-14 w-14 text-primary" strokeWidth={1.5} />
			<h2 className="mb-2 font-extrabold font-heading text-2xl text-slate-900 tracking-tight md:text-3xl">
				{titulo}
			</h2>
			<p className="max-w-md text-slate-600 text-sm leading-relaxed md:text-base">{descripcion}</p>
		</div>
	);
}
