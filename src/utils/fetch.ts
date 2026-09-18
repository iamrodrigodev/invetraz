export async function fetchSeguro(
	url: string,
	options: RequestInit = {},
): Promise<Response> {
	try {
		options.credentials = "include";
		return await fetch(url, options);
	} catch (_error) {
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
		return mensajePorDefecto;
	}
}
