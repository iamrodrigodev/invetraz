// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { AlertCircle, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/Badge.tsx";

export type TipoEstadoConexion =
	| "conectado"
	| "guardado_pendiente"
	| "no_configurado"
	| "verificando"
	| "error"
	| "no_disponible";

interface EstadoConexionBadgeProps {
	estado: TipoEstadoConexion;
	className?: string;
}

export const EstadoConexionBadge: React.FC<EstadoConexionBadgeProps> = ({ estado, className }) => {
	switch (estado) {
		case "conectado":
			return (
				<Badge variant="success" className={className}>
					<CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
					<span>Conexión activa con Google</span>
				</Badge>
			);
		case "guardado_pendiente":
			return (
				<Badge variant="warning" className={className}>
					<AlertCircle size={13} className="shrink-0 text-amber-600" />
					<span>Guardada, no verificada</span>
				</Badge>
			);
		case "no_disponible":
			return (
				<Badge variant="warning" className={className}>
					<AlertCircle size={13} className="shrink-0 text-amber-600" />
					<span>No se puede usar</span>
				</Badge>
			);
		case "verificando":
			return (
				<Badge variant="primary" className={className}>
					<RefreshCw size={13} className="shrink-0 animate-spin text-primary" />
					<span>Verificando conexión...</span>
				</Badge>
			);
		case "error":
			return (
				<Badge variant="destructive" className={className}>
					<XCircle size={13} className="shrink-0 text-red-600" />
					<span>Error de conexión</span>
				</Badge>
			);
		case "no_configurado":
			return (
				<Badge variant="warning" className={className}>
					<AlertCircle size={13} className="shrink-0 text-amber-600" />
					<span>Pendiente de configuración</span>
				</Badge>
			);
		default:
			return null;
	}
};
