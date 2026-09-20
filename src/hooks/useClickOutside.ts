import { type RefObject, useEffect } from "react";

export function useClickOutside<T extends HTMLElement = HTMLElement>(
	ref: RefObject<T | null>,
	handler: () => void,
	enabled = true,
): void {
	useEffect(() => {
		if (!enabled) return;

		const listener = (event: MouseEvent | TouchEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) return;
			if (!ref.current || ref.current.contains(target)) {
				return;
			}
			handler();
		};

		const escapeListener = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handler();
			}
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);
		document.addEventListener("keydown", escapeListener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
			document.removeEventListener("keydown", escapeListener);
		};
	}, [ref, handler, enabled]);
}
