// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { Microscope } from "lucide-react";
import { cn } from "@/utils/cn.ts";

export interface LogoProps {
	estaColapsado?: boolean;
	className?: string;
}

export function Logo({ estaColapsado = false, className }: LogoProps) {
	return (
		<div
			className={cn(
				"flex w-full select-none items-center font-bold text-base text-slate-900 tracking-tight",
				className,
			)}
		>
			<div className="flex h-11 w-11 shrink-0 items-center justify-center">
				<Microscope className="h-6 w-6 text-primary" strokeWidth={2.2} />
			</div>
			<div
				className={cn(
					"flex items-center overflow-hidden whitespace-nowrap font-heading transition-[margin,max-width,opacity] duration-300 ease-in-out",
					estaColapsado ? "ml-0 max-w-0 opacity-0" : "ml-1.5 max-w-xs opacity-100",
				)}
			>
				<span className="text-slate-900">
					Sistema de <span className="font-bold text-primary">Investigación</span>
				</span>
			</div>
		</div>
	);
}
