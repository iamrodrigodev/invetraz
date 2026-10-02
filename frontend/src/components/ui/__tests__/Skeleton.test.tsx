import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "@/components/ui/Skeleton.tsx";

describe("Skeleton", () => {
	it("renderiza correctamente con animacion de pulso y aria-hidden", () => {
		const { container } = render(<Skeleton className="h-6 w-32" />);
		const el = container.firstChild as HTMLElement;
		expect(el.className).toContain("animate-pulse");
		expect(el.className).toContain("h-6");
		expect(el.getAttribute("aria-hidden")).toBe("true");
	});
});
