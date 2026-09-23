// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { useEffect, useRef, useState } from "react";

export interface OpcionesClipboard {
	tiempoResetMs?: number;
}

export function useClipboard(opciones: OpcionesClipboard = {}) {
	const { tiempoResetMs = 2000 } = opciones;
	const [copiadoId, setCopiadoId] = useState<string | null>(null);
	const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (temporizador.current) {
				clearTimeout(temporizador.current);
			}
		},
		[],
	);

	const copiar = async (texto: string, id = "unico"): Promise<boolean> => {
		try {
			await navigator.clipboard.writeText(texto);
		} catch {
			const input = document.createElement("textarea");
			input.value = texto;
			document.body.appendChild(input);
			input.select();
			const doc = document as unknown as {
				execCommand?: (commandId: string) => boolean;
			};
			const correcto = Boolean(doc.execCommand?.("copy"));
			input.remove();
			if (!correcto) {
				return false;
			}
		}
		if (temporizador.current) {
			clearTimeout(temporizador.current);
		}
		setCopiadoId(id);
		temporizador.current = setTimeout(() => setCopiadoId(null), tiempoResetMs);
		return true;
	};

	return {
		copiadoId,
		copiado: copiadoId !== null,
		esCopiado: (id = "unico") => copiadoId === id,
		copiar,
	};
}
