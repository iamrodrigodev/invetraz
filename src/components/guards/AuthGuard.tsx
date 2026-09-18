import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

export function AuthGuard() {
	const autenticado = useAppStore((state) => state.autenticado);

	if (!autenticado) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}
