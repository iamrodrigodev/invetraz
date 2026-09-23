// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { cn } from "@/utils/cn.ts";

export interface SpinnerProps {
	size?: "sm" | "md" | "lg" | "xl";
	color?: "primary" | "white" | "slate";
	mensaje?: string;
	className?: string;
	spinnerClassName?: string;
	fullContainer?: boolean;
}

export function Spinner({
	size = "md",
	color = "primary",
	mensaje,
	className,
	spinnerClassName,
	fullContainer = false,
}: SpinnerProps) {
	const sizeStyles = {
		sm: "h-4 w-4 border-2",
		md: "h-8 w-8 border-2",
		lg: "h-10 w-10 border-3",
		xl: "h-14 w-14 border-4",
	}[size];

	const colorStyles = {
		primary: "border-primary border-t-transparent",
		white: "border-white border-t-transparent",
		slate: "border-slate-400 border-t-transparent",
	}[color];

	const spinnerElement = (
		<div
			className={cn("animate-spin rounded-full", sizeStyles, colorStyles, spinnerClassName)}
			role="status"
			aria-label={mensaje || "Cargando..."}
		/>
	);

	if (fullContainer || mensaje) {
		return (
			<div
				className={cn(
					"flex flex-col items-center justify-center gap-3 text-center",
					fullContainer &&
						"h-full min-h-[450px] w-full flex-1 rounded-3xl border border-slate-200/60 bg-white p-8",
					className,
				)}
			>
				{spinnerElement}
				{mensaje && (
					<p className="max-w-md text-slate-500 text-sm leading-relaxed md:text-base">{mensaje}</p>
				)}
			</div>
		);
	}

	return spinnerElement;
}
