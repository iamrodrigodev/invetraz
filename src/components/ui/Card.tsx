// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import type React from "react";
import { cn } from "@/utils/cn.ts";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"rounded-2xl border border-slate-200/80 bg-white text-slate-900 shadow-xs transition-shadow duration-200",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function CardHeader({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
			{children}
		</div>
	);
}

export function CardTitle({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3
			className={cn("font-heading font-semibold text-lg text-slate-900 tracking-tight", className)}
			{...props}
		>
			{children}
		</h3>
	);
}

export function CardDescription({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p className={cn("text-slate-600 text-sm", className)} {...props}>
			{children}
		</p>
	);
}

export function CardContent({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("p-6 pt-0", className)} {...props}>
			{children}
		</div>
	);
}

export function CardFooter({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("flex items-center border-slate-100 p-6 pt-0", className)} {...props}>
			{children}
		</div>
	);
}
