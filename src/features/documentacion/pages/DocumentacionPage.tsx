import { BookOpen } from "lucide-react";
import type React from "react";
import {
	TarjetaDocClassroom,
	TarjetaDocDrive,
	TarjetaDocGoogleCloud,
	TarjetaDocOAuthPlayground,
} from "../components";

export const DocumentacionPage: React.FC = () => {
	return (
		<div className="space-y-6 pb-12 w-full">
			<div>
				<div className="flex items-center gap-2.5 text-primary mb-1">
					<BookOpen size={22} className="shrink-0" />
					<h1 className="font-extrabold font-heading text-2xl text-slate-900 tracking-tight sm:text-3xl">
						Documentación de Integración
					</h1>
				</div>
				<p className="mt-1 text-sm text-slate-600">
					Guía y referencia técnica de credenciales OAuth 2.0 y permisos
					requeridos para la sincronización con Google Classroom y Google Drive.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<TarjetaDocGoogleCloud />
				<TarjetaDocClassroom />
				<TarjetaDocDrive />
				<TarjetaDocOAuthPlayground />
			</div>
		</div>
	);
};

export default DocumentacionPage;
