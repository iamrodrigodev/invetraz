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
		const contentType = res.headers.get("content-type");
		if (!contentType?.includes("application/json")) {
			return mensajePorDefecto;
		}
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

export async function parsearJsonSeguro<T>(res: Response): Promise<T> {
	const contentType = res.headers.get("content-type");
	if (!contentType?.includes("application/json")) {
		throw new Error(
			"Error de comunicación con el servidor. Inténtalo de nuevo más tarde.",
		);
	}
	return (await res.json()) as T;
}
