type LimpiadorSesion = () => void;

const limpiadores: Set<LimpiadorSesion> = new Set();

export function registrarLimpiadorSesion(limpiador: LimpiadorSesion): () => void {
	limpiadores.add(limpiador);
	return () => {
		limpiadores.delete(limpiador);
	};
}

export function ejecutarLimpiezaSesion(): void {
	for (const limpiador of limpiadores) {
		try {
			limpiador();
		} catch {}
	}
}
