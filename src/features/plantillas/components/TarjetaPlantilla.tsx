// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { Calendar, Download, ExternalLink, FileSpreadsheet } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/Badge.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Card, CardContent } from "@/components/ui/Card.tsx";
import type { PlantillaXlsx } from "@/features/plantillas/types/plantillas.types.ts";

export interface TarjetaPlantillaProps {
	plantilla: PlantillaXlsx;
}

function formatearTamano(bytes?: number | null): string {
	if (!bytes || bytes <= 0) {
		return "Hoja de cálculo en nube";
	}
	const k = 1024;
	const tamanios = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${tamanios[i]}`;
}

function formatearFecha(fechaIso?: string | null): string {
	if (!fechaIso) {
		return "Sin fecha registrada";
	}
	try {
		const fecha = new Date(fechaIso);
		return new Intl.DateTimeFormat("es-PE", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(fecha);
	} catch {
		return fechaIso;
	}
}

export const TarjetaPlantilla: React.FC<TarjetaPlantillaProps> = ({ plantilla }) => {
	const esGoogleSheet = plantilla.tipoMime === "application/vnd.google-apps.spreadsheet";

	return (
		<Card className="border-slate-200/90 bg-white shadow-xs">
			<CardContent className="space-y-4 px-6 pt-6 pb-5">
				<div className="flex items-center justify-between gap-4">
					<div className="min-w-0">
						<h3
							className="line-clamp-2 font-bold text-slate-900 text-sm leading-snug"
							title={plantilla.nombre}
						>
							{plantilla.nombre}
						</h3>
					</div>
					<Badge
						variant={esGoogleSheet ? "success" : "primary"}
						className="shrink-0 font-semibold text-[10.5px] uppercase tracking-wider"
					>
						<FileSpreadsheet size={12} className="shrink-0" />
						{esGoogleSheet ? "Google Sheets" : "XLSX"}
					</Badge>
				</div>

				<div className="space-y-3 border-slate-100 border-t pt-3 text-slate-600 text-xs">
					<div className="flex items-center justify-between gap-3">
						<span>Tamaño</span>
						<span className="truncate text-right font-medium text-slate-800">
							{formatearTamano(plantilla.tamanoBytes)}
						</span>
					</div>

					<div className="flex items-center justify-between gap-3">
						<span className="inline-flex items-center gap-1.5">
							<Calendar size={13} className="shrink-0 text-slate-400" />
							Modificado
						</span>
						<span className="truncate text-right font-medium text-[11px] text-slate-800">
							{formatearFecha(plantilla.ultimaModificacion)}
						</span>
					</div>

					<div className="flex items-center gap-2 pt-2">
						{plantilla.enlaceWeb ? (
							<Button
								type="button"
								variant="default"
								size="default"
								onClick={() => {
									if (plantilla.enlaceWeb) {
										window.open(plantilla.enlaceWeb, "_blank", "noopener,noreferrer");
									}
								}}
								className="w-full"
							>
								<ExternalLink size={16} className="mr-2" />
								Abrir plantilla
							</Button>
						) : null}

						{plantilla.enlaceDescarga && (
							<a
								href={plantilla.enlaceDescarga}
								target="_blank"
								rel="noreferrer"
								download={true}
								title="Descargar archivo"
							>
								<Button
									type="button"
									variant="outline"
									size="default"
									className="px-3 text-slate-700 hover:border-primary-300 hover:text-primary"
								>
									<Download size={16} />
								</Button>
							</a>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default TarjetaPlantilla;
