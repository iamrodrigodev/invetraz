import { beforeEach, describe, expect, it, vi } from "vitest";

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

vi.mock("react-dom/client", () => ({
	createRoot: createRootMock,
}));

vi.mock("@/AppRouter", () => ({
	AppRouter: () => null,
}));

describe("main entrypoint", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetModules();
		document.body.innerHTML = "";
	});

	it("inicializa createRoot y render cuando existe el elemento root", async () => {
		const root = document.createElement("div");
		root.id = "root";
		document.body.appendChild(root);

		await import("@/main.tsx");

		expect(createRootMock).toHaveBeenCalledWith(root);
		expect(renderMock).toHaveBeenCalled();
	});

	it("no ejecuta render si no existe el elemento root", async () => {
		await import("@/main.tsx");

		expect(createRootMock).not.toHaveBeenCalled();
		expect(renderMock).not.toHaveBeenCalled();
	});
});
