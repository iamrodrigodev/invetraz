// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/Button.tsx";
import { cn } from "@/utils/cn.ts";

export interface PiePaginacionPlantillasProps {
	indiceInicio: number;
	indiceFin: number;
	totalItems: number;
	paginaActual: number;
	totalPaginas: number;
	onCambiarPagina: (pagina: number) => void;
	className?: string;
}

export const PiePaginacionPlantillas: React.FC<PiePaginacionPlantillasProps> = ({
	indiceInicio,
	indiceFin,
	totalItems,
	paginaActual,
	totalPaginas,
	onCambiarPagina,
	className,
}) => {
	const ultimoItem = Math.min(indiceFin, totalItems);

	return (
		<div
			className={cn(
				"flex w-full flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
		>
			<p className="font-medium text-slate-600 text-xs">
				Mostrando <span className="font-semibold text-slate-900">{indiceInicio + 1}</span> a{" "}
				<span className="font-semibold text-slate-900">{ultimoItem}</span> de{" "}
				<span className="font-semibold text-slate-900">{totalItems}</span>{" "}
				{totalItems === 1 ? "plantilla" : "plantillas"}
			</p>

			{totalPaginas > 1 && (
				<div className="flex items-center gap-1.5 self-center sm:self-auto">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onCambiarPagina(Math.max(1, paginaActual - 1))}
						disabled={paginaActual === 1}
						className="h-8 px-2.5 font-medium text-xs"
					>
						<ChevronLeft size={14} className="mr-1" />
						Anterior
					</Button>

					<div className="flex items-center gap-1">
						{Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
							<Button
								key={num}
								type="button"
								variant={paginaActual === num ? "default" : "outline"}
								size="sm"
								onClick={() => onCambiarPagina(num)}
								className="h-8 w-8 p-0 font-medium text-xs"
							>
								{num}
							</Button>
						))}
					</div>

					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onCambiarPagina(Math.min(totalPaginas, paginaActual + 1))}
						disabled={paginaActual === totalPaginas}
						className="h-8 px-2.5 font-medium text-xs"
					>
						Siguiente
						<ChevronRight size={14} className="ml-1" />
					</Button>
				</div>
			)}
		</div>
	);
};

export default PiePaginacionPlantillas;
