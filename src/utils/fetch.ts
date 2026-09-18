export async function fetchSeguro(
	url: string,
	options?: RequestInit,
): Promise<Response> {
	try {
		return await fetch(url, options);
	} catch (_error) {
		// Este bloque catch atrapa errores de red (CORS, servidor caído, sin internet)
		throw new Error(
			"El servidor no responde. Verifica que esté encendido o revisa tu conexión a internet.",
		);
	}
}

export async function extraerMensajeError(
	res: Response,
	mensajePorDefecto: string,
): Promise<string> {
	try {
		const errorData = await res.json();
		return (
			errorData.mensaje ||
			errorData.message ||
			errorData.error ||
			mensajePorDefecto
		);
	} catch (_e) {
		// Si el cuerpo no es JSON (ej. 502 Bad Gateway html)
		return mensajePorDefecto;
	}
}
