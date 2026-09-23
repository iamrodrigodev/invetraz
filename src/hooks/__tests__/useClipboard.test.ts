import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useClipboard } from "@/hooks/useClipboard.ts";

describe("useClipboard", () => {
	const writeTextMock = vi.fn();

	beforeEach(() => {
		vi.useFakeTimers();
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

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("copia texto al portapapeles y resetea el estado tras el timeout", async () => {
		const { result } = renderHook(() => useClipboard({ tiempoResetMs: 1500 }));

		expect(result.current.copiado).toBe(false);
		expect(result.current.copiadoId).toBeNull();

		let exitoso = false;
		await act(async () => {
			exitoso = await result.current.copiar("texto-de-prueba", "id-1");
		});

		expect(exitoso).toBe(true);
		expect(writeTextMock).toHaveBeenCalledWith("texto-de-prueba");
		expect(result.current.copiado).toBe(true);
		expect(result.current.copiadoId).toBe("id-1");
		expect(result.current.esCopiado("id-1")).toBe(true);
		expect(result.current.esCopiado("id-2")).toBe(false);

		act(() => {
			vi.advanceTimersByTime(1500);
		});

		expect(result.current.copiado).toBe(false);
		expect(result.current.copiadoId).toBeNull();
	});

	it("utiliza valores por defecto cuando no se pasan opciones ni id", async () => {
		const { result } = renderHook(() => useClipboard());

		await act(async () => {
			await result.current.copiar("texto");
		});

		expect(result.current.copiadoId).toBe("unico");
		expect(result.current.esCopiado()).toBe(true);

		act(() => {
			vi.advanceTimersByTime(2000);
		});

		expect(result.current.copiado).toBe(false);
	});

	it("reemplaza el temporizador previo si se copia sucesivamente", async () => {
		const { result } = renderHook(() => useClipboard({ tiempoResetMs: 2000 }));

		await act(async () => {
			await result.current.copiar("texto-1", "id-1");
		});

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		await act(async () => {
			await result.current.copiar("texto-2", "id-2");
		});

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.copiadoId).toBe("id-2");

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.copiadoId).toBeNull();
	});

	it("usa fallback de execCommand cuando writeText falla", async () => {
		writeTextMock.mockRejectedValue(new Error("Acceso denegado"));
		const execCommandMock = vi.fn().mockReturnValue(true);
		Object.defineProperty(document, "execCommand", {
			value: execCommandMock,
			configurable: true,
			writable: true,
		});

		const { result } = renderHook(() => useClipboard());

		let copiado = false;
		await act(async () => {
			copiado = await result.current.copiar("fallback-texto");
		});

		expect(copiado).toBe(true);
		expect(execCommandMock).toHaveBeenCalledWith("copy");
	});

	it("retorna false si fallback de execCommand tambien falla", async () => {
		writeTextMock.mockRejectedValue(new Error("Acceso denegado"));
		const execCommandMock = vi.fn().mockReturnValue(false);
		Object.defineProperty(document, "execCommand", {
			value: execCommandMock,
			configurable: true,
			writable: true,
		});

		const { result } = renderHook(() => useClipboard());

		let copiado = false;
		await act(async () => {
			copiado = await result.current.copiar("fallo-total");
		});

		expect(copiado).toBe(false);
		expect(result.current.copiado).toBe(false);
	});

	it("limpia el temporizador al desmontar el hook", async () => {
		const { result, unmount } = renderHook(() => useClipboard({ tiempoResetMs: 2000 }));

		await act(async () => {
			await result.current.copiar("texto");
		});

		unmount();
	});
});
