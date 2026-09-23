import { useClipboard } from "@/hooks/useClipboard.ts";

export function useCopiarTexto() {
	const { copiadoId, copiar } = useClipboard({ tiempoResetMs: 2000 });
	return { copiadoId, copiar };
}
