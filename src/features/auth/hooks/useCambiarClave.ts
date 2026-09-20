import { useState } from "react";
import type {
	CambiarClavePaso1FormData,
	CambiarClavePaso2FormData,
} from "../../../schemas/auth.schemas";
import { cambiarPassword, verificarPasswordActual } from "../api/auth.api";

export type EstadoCambiarClave =
	| { tipo: "inactivo" }
	| { tipo: "verificando" }
	| { tipo: "actualizando" }
	| { tipo: "exito" }
	| { tipo: "error"; mensaje: string };

export function useCambiarClave() {
	const [paso, setPaso] = useState<1 | 2>(1);
	const [claveActualVerificada, setClaveActualVerificada] = useState("");
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
		data: CambiarClavePaso1FormData,
	): Promise<boolean> => {
		setEstado({ tipo: "verificando" });
		try {
			await verificarPasswordActual(data.claveActual);
			setClaveActualVerificada(data.claveActual);
			setPaso(2);
			setEstado({ tipo: "inactivo" });
			return true;
		} catch (error) {
			setEstado({
				tipo: "error",
				mensaje:
					error instanceof Error
						? error.message
						: "La contraseña actual es incorrecta",
			});
			return false;
		}
	};

	const actualizarClave = async (
		data: CambiarClavePaso2FormData,
	): Promise<boolean> => {
		setEstado({ tipo: "actualizando" });
		try {
			await cambiarPassword(claveActualVerificada, data.nuevaClave);
			setEstado({ tipo: "exito" });
			return true;
		} catch (error) {
			setEstado({
				tipo: "error",
				mensaje:
					error instanceof Error
						? error.message
						: "Hubo un error al actualizar la contraseña",
			});
			return false;
		}
	};

	const reiniciar = () => {
		setPaso(1);
		setClaveActualVerificada("");
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
