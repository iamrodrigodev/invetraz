import { Navigate, Outlet } from "react-router-dom";

export function AuthGuard() {
	const jwt = localStorage.getItem("jwt");

	if (!jwt) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}
