// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { LogOut } from "lucide-react";
import { cn } from "@/utils/cn.ts";

export interface BotonCerrarSesionProps {
	estaColapsado?: boolean;
	alHacerClic: () => void;
	className?: string;
}

export function BotonCerrarSesion({
	estaColapsado = false,
	alHacerClic,
	className,
}: BotonCerrarSesionProps) {
	return (
		<div className={cn("group/logout relative flex w-full", className)}>
			<button
				type="button"
				onClick={alHacerClic}
				aria-label="Cerrar Sesión"
				className="flex h-11 w-full cursor-pointer items-center overflow-hidden rounded-xl bg-white font-medium text-[15px] text-red-600 transition-colors duration-150 ease-in-out hover:bg-red-50 hover:text-red-700"
			>
				<div className="flex h-11 w-11 shrink-0 items-center justify-center">
					<LogOut
						className="h-5 w-5 shrink-0 text-red-500 transition-colors group-hover/logout:text-red-600"
						strokeWidth={2}
					/>
				</div>
				<span
					className={cn(
						"overflow-hidden whitespace-nowrap text-left transition-[margin,max-width,opacity] duration-300 ease-in-out",
						estaColapsado ? "ml-0 max-w-0 opacity-0" : "ml-1.5 max-w-45 opacity-100",
					)}
				>
					Cerrar Sesión
				</span>
			</button>

			{estaColapsado && (
				<div className="pointer-events-none absolute top-1/2 left-full z-50 ml-2.5 -translate-y-1/2 whitespace-nowrap rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white text-xs opacity-0 shadow-md transition-opacity duration-150 group-hover/logout:opacity-100">
					Cerrar Sesión
					<div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-red-600" />
				</div>
			)}
		</div>
	);
}
