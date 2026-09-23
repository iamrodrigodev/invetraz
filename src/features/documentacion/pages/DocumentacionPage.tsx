import type React from "react";
import { TarjetaDocClassroom } from "@/features/documentacion/components/TarjetaDocClassroom.tsx";
import { TarjetaDocDrive } from "@/features/documentacion/components/TarjetaDocDrive.tsx";
import { TarjetaDocGoogleCloud } from "@/features/documentacion/components/TarjetaDocGoogleCloud.tsx";
import { TarjetaDocOAuthPlayground } from "@/features/documentacion/components/TarjetaDocOAuthPlayground.tsx";

export const DocumentacionPage: React.FC = () => (
	<div className="w-full space-y-5 pb-12 sm:space-y-6">
		<div>
			<h1 className="font-extrabold font-heading text-2xl text-slate-900 tracking-tight sm:text-3xl">
				Documentación de Integración
			</h1>
			<p className="mt-1 text-slate-600 text-sm">
				Guía y referencia técnica de credenciales OAuth 2.0 y permisos requeridos para la
				sincronización con Google Classroom y Google Drive.
			</p>
		</div>

		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
			<TarjetaDocGoogleCloud />
			<TarjetaDocClassroom />
			<TarjetaDocDrive />
			<TarjetaDocOAuthPlayground />
		</div>
	</div>
);

export default DocumentacionPage;
