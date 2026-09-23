// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { CheckCircle2, X } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/Button.tsx";
import { Modal } from "@/components/ui/Modal.tsx";

export interface ModalExitoGeneracionProps {
	abierto: boolean;
	alAceptar: () => void;
}

export const ModalExitoGeneracion: React.FC<ModalExitoGeneracionProps> = ({
	abierto,
	alAceptar,
}) => (
	<Modal abierto={abierto} alCerrar={alAceptar} className="relative max-w-sm p-6 text-center">
		<button
			type="button"
			onClick={alAceptar}
			aria-label="Cerrar modal"
			className="absolute top-4 right-4 inline-flex cursor-pointer rounded-md p-0.5 text-slate-500 opacity-70 outline-none transition-all hover:bg-black/5 hover:text-slate-800 hover:opacity-100 active:scale-95"
		>
			<X size={18} />
		</button>

		<div className="flex flex-col items-center justify-center gap-3 pt-2 text-center">
			<CheckCircle2 size={48} className="mb-1 text-emerald-600" strokeWidth={1.8} />

			<div className="text-center">
				<h3 className="font-bold font-heading text-slate-900 text-xl">
					Actividad de seguimiento generada
				</h3>
				<p className="mt-2 text-slate-600 text-sm leading-relaxed">
					¡Actividad de seguimiento generada con éxito!
				</p>
			</div>
		</div>

		<div className="mt-6">
			<Button
				type="button"
				variant="default"
				onClick={alAceptar}
				className="h-11 w-full rounded-xl font-semibold text-[15px] shadow-sm active:scale-98"
				size="lg"
			>
				Aceptar
			</Button>
		</div>
	</Modal>
);

export default ModalExitoGeneracion;
