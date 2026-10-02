import { beforeEach, vi } from "vitest";

beforeEach(() => {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ datos: [], mensaje: "ok", plantillas: [] }), {
				headers: { "content-type": "application/json" },
				status: 200,
			}),
		),
	);
});
