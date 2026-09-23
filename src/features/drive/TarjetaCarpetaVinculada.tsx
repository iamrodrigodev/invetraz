// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { AlertTriangle, CircleCheck, ExternalLink, FolderCheck, RefreshCw } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/Badge.tsx";
import { Button } from "@/components/ui/Button.tsx";
import {
	type EstadoCarpetaDrive,
	resolverVistaCarpetaDrive,
} from "@/features/drive/estadoCarpetaDrive.ts";

export interface TarjetaCarpetaVinculadaProps {
	nombre?: string | null | undefined;
	carpetaId: string;
	textoBoton?: string | undefined;
	estado?: EstadoCarpetaDrive | undefined;
	compacto?: boolean | undefined;
}

export const TarjetaCarpetaVinculada: React.FC<TarjetaCarpetaVinculadaProps> = ({
	nombre,
	carpetaId,
	textoBoton = "Abrir en Drive",
	estado = "verificada",
	compacto = false,
}) => {
	const vista = resolverVistaCarpetaDrive({
		carpetaId,
		carpetaNombre: estado === "pendiente" ? null : nombre,
		estado,
	});

	const badgeVariant = vista.estaVerificando
		? "primary"
		: vista.estaNoDisponible || vista.estaPendiente
			? "warning"
			: "success";

	if (compacto) {
		return (
			<div className="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-slate-50/60 p-2.5 transition-all sm:flex-row sm:items-center sm:justify-between">
				<div className="flex min-w-0 items-center gap-2.5">
					<FolderCheck size={18} className="shrink-0 stroke-[2.2] text-primary" />
					<div className="flex min-w-0 flex-wrap items-center gap-2">
						<span className="truncate font-semibold text-slate-800 text-xs">
							{vista.nombreVisible}
						</span>
						<Badge
							variant={badgeVariant}
							className="inline-flex items-center gap-1 px-1.5 py-0 font-normal text-[10px]"
						>
							{vista.badgeTexto}
						</Badge>
					</div>
				</div>
				<a
					href={`https://drive.google.com/drive/folders/${carpetaId}`}
					target="_blank"
					rel="noreferrer"
					className="shrink-0 self-start sm:self-auto"
				>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="h-7 border-slate-300 bg-white font-semibold text-slate-700 text-xs hover:border-primary/40 hover:text-primary"
					>
						<ExternalLink size={12} className="mr-1.5" />
						{textoBoton}
					</Button>
				</a>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 transition-all sm:flex-row sm:items-center sm:justify-between">
			<div className="flex min-w-0 items-center gap-3">
				<FolderCheck size={24} className="shrink-0 stroke-[2.2] text-primary" />
				<div className="min-w-0 space-y-1">
					<div className="flex flex-wrap items-center gap-2">
						<span className="truncate font-semibold text-slate-900 text-sm uppercase">
							{vista.nombreVisible}
						</span>
						<Badge
							variant={badgeVariant}
							className="inline-flex items-center gap-1 px-2 py-0.5 font-normal text-[10px]"
						>
							{vista.estaVerificando ? (
								<RefreshCw size={11} className="shrink-0 animate-spin" />
							) : vista.estaNoDisponible || vista.estaPendiente ? (
								<AlertTriangle size={11} className="shrink-0" />
							) : (
								<CircleCheck size={11} className="shrink-0" />
							)}
							{vista.badgeTexto}
						</Badge>
					</div>
					<div className="flex items-center gap-1.5 text-xs">
						<span className="text-slate-500">ID:</span>
						<span
							className="max-w-[180px] select-all truncate text-slate-700 text-xs sm:max-w-xs"
							title={carpetaId}
						>
							{carpetaId}
						</span>
					</div>
				</div>
			</div>
			<a
				href={`https://drive.google.com/drive/folders/${carpetaId}`}
				target="_blank"
				rel="noreferrer"
				className="shrink-0 self-end sm:self-auto"
			>
				<Button
					type="button"
					variant="default"
					size="default"
					className="w-full shadow-xs sm:w-auto"
				>
					<ExternalLink size={16} className="mr-2" />
					{textoBoton}
				</Button>
			</a>
		</div>
	);
};

export default TarjetaCarpetaVinculada;
