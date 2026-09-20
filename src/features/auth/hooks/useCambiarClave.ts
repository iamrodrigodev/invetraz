import { useState } from "react";
import type {
	CambiarClavePaso1FormData,
	CambiarClavePaso2FormData,
} from "../../../schemas/auth.schemas";

export type EstadoCambiarClave =
	| { tipo: "inactivo" }
	| { tipo: "verificando" }
	| { tipo: "actualizando" }
	| { tipo: "exito" }
	| { tipo: "error"; mensaje: string };

export function useCambiarClave() {
	const [paso, setPaso] = useState<1 | 2>(1);
	const [estado, setEstado] = useState<EstadoCambiarClave>({
		tipo: "inactivo",
	});

	const cargando =
		estado.tipo === "verificando" || estado.tipo === "actualizando";
	const exito = estado.tipo === "exito";
	const errorApi = estado.tipo === "error" ? estado.mensaje : null;

	const limpiarError = () => {
		if (estado.tipo === "error") {
			setEstado({ tipo: "inactivo" });
		}
	};

	const verificarPaso1 = async (
		_data: CambiarClavePaso1FormData,
	): Promise<boolean> => {
		setEstado({ tipo: "verificando" });
		try {
			await new Promise((resolve) => setTimeout(resolve, 800));
			setPaso(2);
			setEstado({ tipo: "inactivo" });
			return true;
		} catch (_error) {
			setEstado({
				tipo: "error",
				mensaje: "La contraseña actual es incorrecta",
			});
			return false;
		}
	};

	const actualizarClave = async (
		_data: CambiarClavePaso2FormData,
	): Promise<boolean> => {
		setEstado({ tipo: "actualizando" });
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setEstado({ tipo: "exito" });
			return true;
		} catch (_error) {
			setEstado({
				tipo: "error",
				mensaje: "Hubo un error al actualizar la contraseña",
			});
			return false;
		}
	};

	const reiniciar = () => {
		setPaso(1);
		setEstado({ tipo: "inactivo" });
	};

	return {
		paso,
		setPaso,
		estado,
		cargando,
		exito,
		errorApi,
		limpiarError,
		verificarPaso1,
		actualizarClave,
		reiniciar,
	};
}
