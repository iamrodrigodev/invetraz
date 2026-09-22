import { useEffect, useRef, useState } from "react";

export interface OpcionesClipboard {
	tiempoResetMs?: number;
}

export function useClipboard(opciones: OpcionesClipboard = {}) {
	const { tiempoResetMs = 2000 } = opciones;
	const [copiadoId, setCopiadoId] = useState<string | null>(null);
	const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (temporizador.current) clearTimeout(temporizador.current);
		},
		[],
	);

	const copiar = async (texto: string, id = "unico"): Promise<boolean> => {
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
		temporizador.current = setTimeout(() => setCopiadoId(null), tiempoResetMs);
		return true;
	};

	return {
		copiadoId,
		copiado: copiadoId !== null,
		esCopiado: (id = "unico") => copiadoId === id,
		copiar,
	};
}
