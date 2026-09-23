// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { precargarModulo } from "@/components/navigation/precargaModulos.ts";
import type { ItemNavegacion } from "@/components/navigation/types.ts";
import { cn } from "@/utils/cn.ts";

export interface SidebarItemProps {
	item: ItemNavegacion;
	esActivo: boolean;
	estaColapsado: boolean;
	alHacerClic: () => void;
	className?: string;
}

export function SidebarItem({
	item,
	esActivo,
	estaColapsado,
	alHacerClic,
	className,
}: SidebarItemProps) {
	const Icono = item.icono;
	const etiqueta = item.etiquetaMenu ?? item.titulo;

	return (
		<div className={cn("group/item relative flex w-full", className)}>
			<button
				type="button"
				onClick={alHacerClic}
				onMouseEnter={() => precargarModulo(item.id)}
				aria-label={item.titulo}
				aria-current={esActivo ? "page" : undefined}
				className={cn(
					"flex h-11 w-full cursor-pointer items-center overflow-hidden rounded-xl font-medium text-[15px] transition-colors duration-150 ease-in-out",
					esActivo
						? "bg-primary text-white shadow-xs"
						: "text-slate-800 hover:bg-slate-100 hover:text-slate-900",
				)}
			>
				<div className="flex h-11 w-11 shrink-0 items-center justify-center">
					<Icono
						className={cn(
							"h-5 w-5 shrink-0 transition-colors",
							esActivo ? "text-white" : "text-slate-700 group-hover/item:text-slate-900",
						)}
						strokeWidth={2.2}
					/>
				</div>
				<span
					className={cn(
						"overflow-hidden whitespace-nowrap text-left transition-[margin,max-width,opacity] duration-300 ease-in-out",
						estaColapsado ? "ml-0 max-w-0 opacity-0" : "ml-1.5 max-w-45 opacity-100",
					)}
				>
					{etiqueta}
				</span>
			</button>

			{estaColapsado && (
				<div className="pointer-events-none absolute top-1/2 left-full z-50 ml-2.5 -translate-y-1/2 whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 font-semibold text-white text-xs opacity-0 shadow-md transition-opacity duration-150 group-hover/item:opacity-100">
					{item.titulo}
					<div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-primary" />
				</div>
			)}
		</div>
	);
}
