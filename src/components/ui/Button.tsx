// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { RefreshCw } from "lucide-react";
import type React from "react";
import { cn } from "@/utils/cn.ts";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
	size?: "default" | "sm" | "lg" | "icon" | "icon-sm";
	isLoading?: boolean;
}

export const Button = ({
	className,
	variant = "default",
	size = "default",
	type = "button",
	isLoading = false,
	children,
	disabled,
	ref,
	...props
}: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
	const variantStyles = {
		default: "bg-primary text-white shadow-xs hover:bg-primary-700 focus-visible:ring-primary",
		outline:
			"border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-primary",
		secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400",
		ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400",
		destructive: "bg-red-600 text-white shadow-xs hover:bg-red-700 focus-visible:ring-red-500",
		link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
	}[variant];

	const sizeStyles = {
		default: "h-9 px-4 py-2 text-sm rounded-lg gap-2",
		sm: "h-7 px-2.5 text-xs rounded-md gap-1.5",
		lg: "h-11 px-6 text-base rounded-xl gap-2.5",
		icon: "h-9 w-9 p-0 rounded-lg justify-center",
		"icon-sm": "h-7 w-7 p-0 rounded-md justify-center",
	}[size];

	return (
		<button
			ref={ref}
			type={type}
			disabled={disabled || isLoading}
			aria-busy={isLoading}
			className={cn(
				"inline-flex cursor-pointer select-none items-center justify-center font-medium transition-all duration-150 ease-in-out",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-98 disabled:pointer-events-none disabled:opacity-50",
				variantStyles,
				sizeStyles,
				className,
			)}
			{...props}
		>
			{isLoading && <RefreshCw className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />}
			{children}
		</button>
	);
};

Button.displayName = "Button";
