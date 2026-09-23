import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useClipboard } from "@/hooks/useClipboard";

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
});
