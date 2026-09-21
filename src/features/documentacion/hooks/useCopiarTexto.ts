import { useEffect, useRef, useState } from "react";

export function useCopiarTexto() {
	const [copiadoId, setCopiadoId] = useState<string | null>(null);
	const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (temporizador.current) clearTimeout(temporizador.current);
		},
		[],
	);

	const copiar = async (texto: string, id = "unico") => {
		try {
			await navigator.clipboard.writeText(texto);
		} catch {
			const input = document.createElement("textarea");
			input.value = texto;
			document.body.appendChild(input);
			input.select();
			const correcto = document.execCommand("copy");
			input.remove();
			if (!correcto) return false;
		}
		if (temporizador.current) clearTimeout(temporizador.current);
		setCopiadoId(id);
		temporizador.current = setTimeout(() => setCopiadoId(null), 2000);
		return true;
	};

	return { copiadoId, copiar };
}
