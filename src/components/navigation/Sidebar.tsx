// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BotonCerrarSesion } from "@/components/navigation/BotonCerrarSesion.tsx";
import { Logo } from "@/components/navigation/Logo.tsx";
import { SidebarItem } from "@/components/navigation/SidebarItem.tsx";
import type { ModuloId } from "@/components/navigation/types.ts";
import { ELEMENTOS_NAVEGACION } from "@/constants/navigation.ts";
import { useAppStore } from "@/store/useAppStore.ts";
import { cn } from "@/utils/cn.ts";

export { ELEMENTOS_NAVEGACION };

export interface SidebarProps {
	moduloActivo: ModuloId;
	alSeleccionarModulo: (id: ModuloId) => void;
	estaColapsado: boolean;
	alAlternarColapso: () => void;
	className?: string;
	alSolicitarCerrarSesion?: () => void;
}

export function Sidebar({
	moduloActivo,
	alSeleccionarModulo,
	estaColapsado,
	alAlternarColapso,
	className,
	alSolicitarCerrarSesion,
}: SidebarProps) {
	const navigate = useNavigate();
	const cerrarSesionStore = useAppStore((state) => state.cerrarSesion);

	const manejarCerrarSesion = async () => {
		await cerrarSesionStore();
		navigate("/login", { replace: true });
	};

	return (
		<aside
			className={cn(
				"relative flex h-full w-full select-none flex-col border-slate-200 border-r bg-white text-slate-600",
				className,
			)}
		>
			<button
				type="button"
				onClick={alAlternarColapso}
				aria-label={estaColapsado ? "Expandir barra lateral" : "Colapsar barra lateral"}
				className="absolute top-5 -right-3.5 z-20 hidden h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-slate-50 bg-primary text-white shadow-xs transition-all duration-150 ease-in-out hover:bg-primary-700 active:scale-95 lg:flex"
			>
				{estaColapsado ? (
					<ChevronRight size={15} strokeWidth={2.5} />
				) : (
					<ChevronLeft size={15} strokeWidth={2.5} />
				)}
			</button>

			<div className="flex h-16 shrink-0 items-center border-slate-200 border-b px-4.5">
				<Logo estaColapsado={estaColapsado} />
			</div>

			<nav
				className={cn(
					"flex-1 space-y-1.5 px-4.5 py-5",
					estaColapsado ? "overflow-visible" : "overflow-y-auto overflow-x-hidden",
				)}
			>
				{ELEMENTOS_NAVEGACION.map((item) => (
					<SidebarItem
						key={item.id}
						item={item}
						esActivo={moduloActivo === item.id}
						estaColapsado={estaColapsado}
						alHacerClic={() => alSeleccionarModulo(item.id)}
					/>
				))}
			</nav>

			<div className="border-slate-200/80 border-t px-4.5 py-4">
				<BotonCerrarSesion
					estaColapsado={estaColapsado}
					alHacerClic={alSolicitarCerrarSesion ?? manejarCerrarSesion}
				/>
			</div>
		</aside>
	);
}
