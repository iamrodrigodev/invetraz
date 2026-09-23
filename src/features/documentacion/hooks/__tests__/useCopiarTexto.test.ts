import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCopiarTexto } from "@/features/documentacion/hooks/useCopiarTexto.ts";

describe("useCopiarTexto", () => {
	it("expone copiadoId y permite copiar texto", async () => {
		const writeTextMock = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText: writeTextMock },
			configurable: true,
			writable: true,
		});

		const { result } = renderHook(() => useCopiarTexto());
		expect(result.current.copiadoId).toBeNull();

		await act(async () => {
			await result.current.copiar("url-doc", "btn-url");
		});

		expect(result.current.copiadoId).toBe("btn-url");
		expect(writeTextMock).toHaveBeenCalledWith("url-doc");
	});
});
