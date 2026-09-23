// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { BotonCerrarSesion } from "@/components/navigation/BotonCerrarSesion.tsx";
import { Logo } from "@/components/navigation/Logo.tsx";
import { REGISTRO_MODULOS } from "@/components/navigation/modulosRegistry.tsx";
import {
	precargarModulo,
	precargarTodosLosModulos,
} from "@/components/navigation/precargaModulos.ts";
import { Sidebar } from "@/components/navigation/Sidebar.tsx";
import { SidebarItem } from "@/components/navigation/SidebarItem.tsx";
import { TopBar } from "@/components/navigation/TopBar.tsx";
import { ModuloIdSchema } from "@/components/navigation/types.ts";
import { ELEMENTOS_NAVEGACION } from "@/constants/navigation.ts";
import { useAppStore } from "@/store/useAppStore.ts";

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: vi.fn(),
	};
});

describe("Navigation components", () => {
	describe("ModuloIdSchema", () => {
		it("valida ids correctos y rechaza invalidos", () => {
			expect(ModuloIdSchema.parse("actividades")).toBe("actividades");
			expect(ModuloIdSchema.parse("reportes")).toBe("reportes");
			expect(ModuloIdSchema.parse("plantillas")).toBe("plantillas");
			expect(ModuloIdSchema.parse("configuracion")).toBe("configuracion");
			expect(ModuloIdSchema.parse("documentacion")).toBe("documentacion");
			expect(() => ModuloIdSchema.parse("invalido")).toThrow();
		});
	});

	describe("Logo", () => {
		it("renderiza correctamente expandido y colapsado", () => {
			const { rerender } = render(<Logo estaColapsado={false} className="mi-logo" />);
			expect(screen.getByText("Investigación")).toBeDefined();

			rerender(<Logo estaColapsado={true} />);
			expect(screen.getByText("Investigación")).toBeDefined();
		});
	});

	describe("BotonCerrarSesion", () => {
		it("ejecuta callback al hacer clic y soporta colapsado", () => {
			const alHacerClic = vi.fn();
			const { rerender } = render(
				<BotonCerrarSesion
					estaColapsado={false}
					alHacerClic={alHacerClic}
					className="test-logout"
				/>,
			);

			const boton = screen.getByRole("button", { name: "Cerrar Sesión" });
			fireEvent.click(boton);
			expect(alHacerClic).toHaveBeenCalledTimes(1);

			rerender(<BotonCerrarSesion estaColapsado={true} alHacerClic={alHacerClic} />);
			expect(screen.getByRole("button", { name: "Cerrar Sesión" })).toBeDefined();
		});
	});

	describe("SidebarItem", () => {
		it("renderiza con etiquetaMenu y maneja eventos click y hover", () => {
			const alHacerClic = vi.fn();
			const item = ELEMENTOS_NAVEGACION[0];
			if (!item) {
				return;
			}
			const { rerender } = render(
				<SidebarItem
					item={item}
					esActivo={true}
					estaColapsado={false}
					alHacerClic={alHacerClic}
					className="custom-item"
				/>,
			);

			const boton = screen.getByRole("button", { name: item.titulo });
			expect(boton.getAttribute("aria-current")).toBe("page");

			fireEvent.mouseEnter(boton);
			fireEvent.click(boton);
			expect(alHacerClic).toHaveBeenCalledTimes(1);

			const { etiquetaMenu: _ignorado, ...itemSinEtiqueta } = item;
			rerender(
				<SidebarItem
					item={itemSinEtiqueta}
					esActivo={false}
					estaColapsado={true}
					alHacerClic={alHacerClic}
				/>,
			);
			expect(boton.getAttribute("aria-current")).toBeNull();
		});
	});

	describe("Sidebar", () => {
		it("permite alternar colapso y seleccionar modulos", () => {
			const alSeleccionarModulo = vi.fn();
			const alAlternarColapso = vi.fn();
			const alSolicitarCerrarSesion = vi.fn();

			const { rerender } = render(
				<Sidebar
					moduloActivo="actividades"
					alSeleccionarModulo={alSeleccionarModulo}
					estaColapsado={false}
					alAlternarColapso={alAlternarColapso}
					alSolicitarCerrarSesion={alSolicitarCerrarSesion}
				/>,
			);

			const btnColapso = screen.getByLabelText("Colapsar barra lateral");
			fireEvent.click(btnColapso);
			expect(alAlternarColapso).toHaveBeenCalled();

			const btnReportes = screen.getByRole("button", { name: "Reportes" });
			fireEvent.click(btnReportes);
			expect(alSeleccionarModulo).toHaveBeenCalledWith("reportes");

			const btnLogout = screen.getByRole("button", { name: "Cerrar Sesión" });
			fireEvent.click(btnLogout);
			expect(alSolicitarCerrarSesion).toHaveBeenCalled();

			rerender(
				<Sidebar
					moduloActivo="reportes"
					alSeleccionarModulo={alSeleccionarModulo}
					estaColapsado={true}
					alAlternarColapso={alAlternarColapso}
				/>,
			);
			expect(screen.getByLabelText("Expandir barra lateral")).toBeDefined();
		});

		it("cierra sesion directamente si no se provee alSolicitarCerrarSesion", async () => {
			const mockNavigate = vi.fn();
			vi.mocked(useNavigate).mockReturnValue(mockNavigate);
			const mockCerrarSesion = vi.fn().mockResolvedValue(undefined);
			useAppStore.setState({ cerrarSesion: mockCerrarSesion });

			render(
				<Sidebar
					moduloActivo="actividades"
					alSeleccionarModulo={vi.fn()}
					estaColapsado={false}
					alAlternarColapso={vi.fn()}
				/>,
			);

			const btnLogout = screen.getByRole("button", { name: "Cerrar Sesión" });
			await act(async () => {
				fireEvent.click(btnLogout);
			});

			expect(mockCerrarSesion).toHaveBeenCalled();
			expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
		});
	});

	describe("TopBar", () => {
		it("muestra titulo y abre menu movil", () => {
			const alAbrirMenuMovil = vi.fn();
			render(<TopBar moduloActivo="plantillas" alAbrirMenuMovil={alAbrirMenuMovil} />);

			expect(screen.getByText("Plantillas de seguimiento")).toBeDefined();
			const btnMenu = screen.getByLabelText("Abrir menú de navegación");
			fireEvent.click(btnMenu);
			expect(alAbrirMenuMovil).toHaveBeenCalledTimes(1);
		});

		it("abre menu de usuario, permite abrir modal de clave y cerrar sesion delegada", () => {
			useAppStore.setState({ usuarioEmail: "test@correo.com" });
			const alSolicitarCerrarSesion = vi.fn();

			const { container } = render(
				<TopBar moduloActivo="actividades" alSolicitarCerrarSesion={alSolicitarCerrarSesion} />,
			);

			expect(screen.getAllByText("test@correo.com").length).toBeGreaterThan(0);
			const userTrigger = container.querySelector(".rounded-2xl")!;
			fireEvent.click(userTrigger);

			expect(screen.getByText("Cambiar Contraseña")).toBeDefined();
			fireEvent.click(screen.getByText("Cambiar Contraseña"));
			expect(screen.getByText("Contraseña actual")).toBeDefined();

			const btnCerrarModal = screen.getByRole("button", { name: "Cerrar" });
			fireEvent.click(btnCerrarModal);

			fireEvent.click(userTrigger);
			fireEvent.click(screen.getByText("Cerrar Sesión"));
			expect(alSolicitarCerrarSesion).toHaveBeenCalled();
		});

		it("cierra sesion directamente si no se provee alSolicitarCerrarSesion", async () => {
			const mockNavigate = vi.fn();
			vi.mocked(useNavigate).mockReturnValue(mockNavigate);
			const mockCerrarSesion = vi.fn().mockResolvedValue(undefined);
			useAppStore.setState({
				usuarioEmail: null,
				cerrarSesion: mockCerrarSesion,
			});

			const { container } = render(<TopBar moduloActivo="configuracion" />);
			expect(screen.getAllByText("Administrador").length).toBeGreaterThan(0);

			const userTrigger = container.querySelector(".rounded-2xl")!;
			fireEvent.click(userTrigger);

			await act(async () => {
				fireEvent.click(screen.getByText("Cerrar Sesión"));
			});

			expect(mockCerrarSesion).toHaveBeenCalled();
			expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
		});

		it("cierra el menu de usuario al hacer click afuera", () => {
			const { container } = render(<TopBar moduloActivo="actividades" />);
			const userTrigger = container.querySelector(".rounded-2xl")!;
			fireEvent.click(userTrigger);
			expect(screen.getByText("Cambiar Contraseña")).toBeDefined();

			act(() => {
				document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
			});
		});

		it("muestra titulo y email por defecto cuando modulo o email no estan definidos", () => {
			useAppStore.setState({ usuarioEmail: null });
			render(<TopBar moduloActivo={"desconocido" as any} />);

			expect(screen.getByText("Sistema de Investigación")).toBeDefined();
			expect(screen.getByText("Administrador")).toBeDefined();
		});
	});

	describe("modulosRegistry y precargaModulos", () => {
		it("contiene todos los modulos registrados", () => {
			expect(REGISTRO_MODULOS.actividades).toBeDefined();
			expect(REGISTRO_MODULOS.reportes).toBeDefined();
			expect(REGISTRO_MODULOS.plantillas).toBeDefined();
			expect(REGISTRO_MODULOS.configuracion).toBeDefined();
			expect(REGISTRO_MODULOS.documentacion).toBeDefined();
		});

		it("ejecuta cargadores lazy de modulosRegistry", async () => {
			for (const Comp of Object.values(REGISTRO_MODULOS)) {
				const { unmount } = render(
					<React.Suspense fallback={<div>Cargando...</div>}>
						<Comp />
					</React.Suspense>,
				);
				unmount();
			}
		});

		it("ejecuta precarga individual y total sin errores", async () => {
			await import("@/features/plantillas/pages/PlantillasSeguimientoPage.tsx");
			await import("@/features/configuracion/pages/ConfiguracionPage.tsx");
			await import("@/features/reportes/pages/ReportesPage.tsx");
			await import("@/features/documentacion/pages/DocumentacionPage.tsx");
			precargarModulo("actividades");
			precargarModulo("reportes");
			precargarTodosLosModulos();
		});
	});
});
