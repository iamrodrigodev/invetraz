// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { BarChart3, BookOpen, ClipboardCheck, LayoutTemplate, Settings } from "lucide-react";
import type { ItemNavegacion } from "@/components/navigation/types.ts";

export const ELEMENTOS_NAVEGACION: ItemNavegacion[] = [
	{
		id: "actividades",
		titulo: "Actividades de seguimiento",
		etiquetaMenu: "Actividades",
		icono: ClipboardCheck,
		descripcion: "Monitoreo y seguimiento de actividades",
	},
	{
		id: "reportes",
		titulo: "Reportes",
		etiquetaMenu: "Reportes",
		icono: BarChart3,
		descripcion: "Informes y análisis de progreso",
	},
	{
		id: "plantillas",
		titulo: "Plantillas de seguimiento",
		etiquetaMenu: "Plantillas",
		icono: LayoutTemplate,
		descripcion: "Modelos y formatos de registro",
	},
	{
		id: "configuracion",
		titulo: "Configuración del Sistema",
		etiquetaMenu: "Configuración",
		icono: Settings,
		descripcion: "Credenciales y parámetros de integración",
	},
	{
		id: "documentacion",
		titulo: "Documentación de Integración",
		etiquetaMenu: "Documentación",
		icono: BookOpen,
		descripcion: "Guías de Google Classroom y permisos",
	},
];
