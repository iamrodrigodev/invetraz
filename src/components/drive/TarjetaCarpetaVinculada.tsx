import { CircleCheck, ExternalLink, FolderCheck } from "lucide-react";
import type React from "react";
import { Badge, Button } from "../ui";

export interface TarjetaCarpetaVinculadaProps {
	nombre?: string | null | undefined;
	carpetaId: string;
	textoBoton?: string;
}

export const TarjetaCarpetaVinculada: React.FC<
	TarjetaCarpetaVinculadaProps
> = ({ nombre, carpetaId, textoBoton = "Abrir en Drive" }) => {
	const nombreCarpeta = nombre || "Carpeta de Google Drive";

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 transition-all sm:flex-row sm:items-center sm:justify-between">
			<div className="flex min-w-0 items-center gap-3">
				<FolderCheck size={24} className="shrink-0 text-primary stroke-[2.2]" />
				<div className="min-w-0 space-y-1">
					<div className="flex flex-wrap items-center gap-2">
						<span className="truncate text-sm font-medium uppercase text-slate-900">
							{nombreCarpeta}
						</span>
						<Badge
							variant="success"
							className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-normal"
						>
							<CircleCheck size={11} className="shrink-0" />
							Carpeta vinculada
						</Badge>
					</div>
					<div className="flex items-center gap-1.5 text-xs">
						<span className="text-slate-500">ID:</span>
						<code className="break-all font-mono text-xs text-slate-700 select-all">
							{carpetaId}
						</code>
					</div>
				</div>
			</div>
			<a
				href={`https://drive.google.com/drive/folders/${carpetaId}`}
				target="_blank"
				rel="noreferrer"
				className="shrink-0 self-end sm:self-auto"
			>
				<Button
					type="button"
					variant="default"
					size="default"
					className="w-full shadow-xs sm:w-auto"
				>
					<ExternalLink size={16} className="mr-2" />
					{textoBoton}
				</Button>
			</a>
		</div>
	);
};

export default TarjetaCarpetaVinculada;
