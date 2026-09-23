// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import type React from "react";
import { cn } from "@/utils/cn.ts";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
	message: string;
	variant?: "error" | "success" | "warning" | "info";
	onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
	message,
	variant = "error",
	onClose,
	className,
	...props
}) => {
	const config = {
		error: {
			estilos: "bg-red-50 border border-red-200 text-red-700",
			icono: <AlertCircle size={18} className="shrink-0 text-red-600" />,
		},
		success: {
			estilos: "bg-emerald-50 border border-emerald-200 text-emerald-700",
			icono: <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />,
		},
		warning: {
			estilos: "bg-amber-50 border border-amber-200 text-amber-800",
			icono: <AlertTriangle size={18} className="shrink-0 text-amber-600" />,
		},
		info: {
			estilos: "bg-blue-50 border border-blue-200 text-blue-700",
			icono: <Info size={18} className="shrink-0 text-blue-600" />,
		},
	}[variant];

	return (
		<div
			role="alert"
			className={cn(
				"flex items-center justify-between gap-3 rounded-xl p-3.5 font-medium text-sm transition-colors",
				config.estilos,
				className,
			)}
			{...props}
		>
			<div className="flex min-w-0 flex-1 items-center gap-2.5">
				{config.icono}
				<span className="break-words leading-snug">{message}</span>
			</div>
			{onClose && (
				<button
					type="button"
					onClick={onClose}
					className="inline-flex shrink-0 cursor-pointer rounded-lg p-1 opacity-70 outline-none transition-all hover:bg-black/5 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current active:scale-95"
					aria-label="Cerrar notificación"
					title="Cerrar"
				>
					<X size={16} />
				</button>
			)}
		</div>
	);
};

export default Alert;
