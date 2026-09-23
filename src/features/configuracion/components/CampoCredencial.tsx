// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { Eye, EyeOff } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Input, type InputProps } from "@/components/ui/Input.tsx";

export interface CampoCredencialProps extends Omit<InputProps, "rightElement"> {
	label: string;
	descripcion?: React.ReactNode;
	obligatorio?: boolean;
	esSensible?: boolean;
}

export const CampoCredencial = ({
	id,
	label,
	descripcion,
	obligatorio = true,
	esSensible = false,
	type = "text",
	maxLength,
	showCount = true,
	errorMessage,
	ref,
	...props
}: CampoCredencialProps & { ref?: React.Ref<HTMLInputElement> | undefined }) => {
	const [mostrarTexto, setMostrarTexto] = useState(false);

	const tipoInput = esSensible ? (mostrarTexto ? "text" : "password") : type;

	const elementoDerecho = esSensible ? (
		<button
			type="button"
			onClick={() => setMostrarTexto((prev) => !prev)}
			aria-label={mostrarTexto ? "Ocultar contenido" : "Mostrar contenido"}
			className="cursor-pointer text-primary/70 transition-colors hover:text-primary focus:outline-none"
		>
			{mostrarTexto ? <EyeOff size={18} /> : <Eye size={18} />}
		</button>
	) : undefined;

	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between">
				<label htmlFor={id} className="block font-medium text-slate-800 text-sm">
					{label} {obligatorio && <span className="text-red-500">*</span>}
				</label>
			</div>

			{descripcion && <p className="text-slate-600 text-xs">{descripcion}</p>}

			<Input
				id={id}
				ref={ref}
				type={tipoInput}
				maxLength={maxLength}
				showCount={showCount}
				errorMessage={errorMessage}
				rightElement={elementoDerecho}
				{...props}
			/>
		</div>
	);
};

CampoCredencial.displayName = "CampoCredencial";
