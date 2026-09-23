// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DefaultClassroom, {
	TarjetaDocClassroom,
} from "@/features/documentacion/components/TarjetaDocClassroom.tsx";
import DefaultDrive, {
	TarjetaDocDrive,
} from "@/features/documentacion/components/TarjetaDocDrive.tsx";
import DefaultGoogleCloud, {
	TarjetaDocGoogleCloud,
} from "@/features/documentacion/components/TarjetaDocGoogleCloud.tsx";
import DefaultPlayground, {
	TarjetaDocOAuthPlayground,
} from "@/features/documentacion/components/TarjetaDocOAuthPlayground.tsx";
import DefaultDocPage, {
	DocumentacionPage,
} from "@/features/documentacion/pages/DocumentacionPage.tsx";

describe("Documentacion Components y Page", () => {
	const writeTextMock = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		writeTextMock.mockReset();
		writeTextMock.mockResolvedValue(undefined);
		Object.defineProperty(navigator, "clipboard", {
			value: {
				writeText: writeTextMock,
			},
			configurable: true,
			writable: true,
		});
	});

	describe("DocumentacionPage", () => {
		it("renderiza encabezado y las 4 tarjetas de documentacion", () => {
			render(<DocumentacionPage />);
			expect(screen.getByText("Documentación de Integración")).toBeDefined();
			expect(screen.getByText("1. Google Cloud (Proyecto y OAuth 2.0)")).toBeDefined();
			expect(screen.getByText("2. Google Classroom API")).toBeDefined();
			expect(screen.getByText("3. Google Drive API")).toBeDefined();
			expect(screen.getByText("4. OAuth 2.0 Playground (Refresh Token)")).toBeDefined();
		});

		it("soporta export por defecto de pagina", () => {
			expect(DefaultDocPage).toBe(DocumentacionPage);
		});
	});

	describe("TarjetaDocGoogleCloud", () => {
		it("permite copiar URI de redireccion", async () => {
			render(<TarjetaDocGoogleCloud />);
			const btnCopiar = screen.getByRole("button", { name: /copiar/iu });
			fireEvent.click(btnCopiar);

			expect(writeTextMock).toHaveBeenCalledWith("https://developers.google.com/oauthplayground");
			await waitFor(() => {
				expect(screen.getByText("Copiado")).toBeDefined();
			});
		});

		it("soporta export por defecto", () => {
			expect(DefaultGoogleCloud).toBe(TarjetaDocGoogleCloud);
		});
	});

	describe("TarjetaDocClassroom", () => {
		it("permite copiar cada scope requerido", async () => {
			render(<TarjetaDocClassroom />);
			const btnsCopiar = screen.getAllByRole("button", { name: /copiar/iu });
			const btn0 = btnsCopiar[0];
			if (btn0) {
				fireEvent.click(btn0);
			}
			expect(writeTextMock).toHaveBeenCalledWith(
				"https://www.googleapis.com/auth/classroom.courses",
			);

			await waitFor(() => {
				expect(screen.getByText("Copiado")).toBeDefined();
			});
		});

		it("soporta export por defecto", () => {
			expect(DefaultClassroom).toBe(TarjetaDocClassroom);
		});
	});

	describe("TarjetaDocDrive", () => {
		it("permite copiar scope de drive", async () => {
			render(<TarjetaDocDrive />);
			const btnCopiar = screen.getByRole("button", { name: /copiar/iu });
			fireEvent.click(btnCopiar);

			expect(writeTextMock).toHaveBeenCalledWith("https://www.googleapis.com/auth/drive.readonly");
			await waitFor(() => {
				expect(screen.getByText("Copiado")).toBeDefined();
			});
		});

		it("soporta export por defecto", () => {
			expect(DefaultDrive).toBe(TarjetaDocDrive);
		});
	});

	describe("TarjetaDocOAuthPlayground", () => {
		it("permite copiar todos los scopes juntos", async () => {
			render(<TarjetaDocOAuthPlayground />);
			const btnCopiar = screen.getByRole("button", { name: /copiar/iu });
			fireEvent.click(btnCopiar);

			expect(writeTextMock).toHaveBeenCalled();
			await waitFor(() => {
				expect(screen.getByText("Copiado")).toBeDefined();
			});
		});

		it("soporta export por defecto", () => {
			expect(DefaultPlayground).toBe(TarjetaDocOAuthPlayground);
		});
	});
});
