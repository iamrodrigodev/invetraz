// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import type React from "react";
import { useEffect, useId, useState } from "react";
import { cn } from "@/utils/cn.ts";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: boolean;
	errorMessage?: React.ReactNode;
	showCount?: boolean;
	charCount?: number;
}

export const Textarea = ({
	id,
	className,
	error,
	errorMessage,
	showCount,
	charCount,
	maxLength,
	onChange,
	value,
	defaultValue,
	rows = 3,
	ref,
	...props
}: TextareaProps & { ref?: React.Ref<HTMLTextAreaElement> | undefined }) => {
	const generatedId = useId();
	const textareaId = id || generatedId;
	const errorId = `${textareaId}-error`;

	const [localCharCount, setLocalCharCount] = useState<number>(() => {
		if (typeof value === "string") {
			return value.length;
		}
		if (typeof defaultValue === "string") {
			return defaultValue.length;
		}
		return 0;
	});

	useEffect(() => {
		if (value !== undefined && typeof value === "string") {
			setLocalCharCount(value.length);
		}
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (showCount || maxLength) {
			setLocalCharCount(e.target.value.length);
		}
		if (onChange) {
			onChange(e);
		}
	};

	const countMostrado =
		typeof charCount === "number"
			? charCount
			: typeof value === "string"
				? value.length
				: localCharCount;

	const hasError = Boolean(error || errorMessage);

	return (
		<div className="w-full">
			<div className="relative w-full">
				<textarea
					id={textareaId}
					ref={ref}
					rows={rows}
					maxLength={maxLength}
					value={value}
					defaultValue={defaultValue}
					onChange={handleChange}
					aria-invalid={hasError}
					aria-describedby={hasError && errorMessage ? errorId : undefined}
					className={cn(
						"flex w-full resize-y rounded-lg border-0 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors duration-150 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
						hasError
							? "ring-1 ring-red-500 ring-inset focus:ring-2 focus:ring-red-500 focus:ring-inset"
							: "ring-1 ring-slate-300 ring-inset focus:ring-2 focus:ring-primary focus:ring-inset",
						className,
					)}
					{...props}
				/>
			</div>
			{(errorMessage || (showCount && maxLength)) && (
				<div className="mt-1.5 flex items-start justify-between gap-3 text-xs">
					<div className="min-w-0 flex-1">
						{errorMessage && (
							<p id={errorId} role="alert" className="font-medium text-red-600 leading-tight">
								{errorMessage}
							</p>
						)}
					</div>
					{showCount && maxLength && (
						<span className="shrink-0 font-medium text-slate-500">
							{countMostrado} / {maxLength}
						</span>
					)}
				</div>
			)}
		</div>
	);
};

Textarea.displayName = "Textarea";
