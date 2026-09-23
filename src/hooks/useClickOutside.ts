// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { type RefObject, useEffect } from "react";

export function useClickOutside<T extends HTMLElement = HTMLElement>(
	ref: RefObject<T | null>,
	handler: () => void,
	enabled = true,
): void {
	useEffect(() => {
		if (!enabled) {
			return;
		}

		const listener = (event: MouseEvent | TouchEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) {
				return;
			}
			if (!ref.current || ref.current.contains(target)) {
				return;
			}
			handler();
		};

		const escapeListener = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handler();
			}
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);
		document.addEventListener("keydown", escapeListener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
			document.removeEventListener("keydown", escapeListener);
		};
	}, [ref, handler, enabled]);
}
