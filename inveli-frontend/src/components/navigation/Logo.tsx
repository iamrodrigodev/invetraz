import { Microscope } from "lucide-react";
import { cn } from "@/utils/cn.ts";

export type LogoProps = {
	estaColapsado?: boolean;
	className?: string;
};

export function Logo({ estaColapsado = false, className }: LogoProps) {
	return (
		<div
			className={cn(
				"flex min-w-0 select-none items-center font-bold text-sm tracking-tight text-slate-900 sm:text-[15px]",
				className,
			)}
		>
			<div className="flex h-9 w-9 shrink-0 items-center justify-center">
				<Microscope className="h-5 w-5 text-primary" strokeWidth={2.2} />
			</div>
			<div
				className={cn(
					"flex items-center overflow-hidden whitespace-nowrap font-heading transition-[margin,max-width,opacity] duration-300 ease-in-out",
					estaColapsado ? "ml-0 max-w-0 opacity-0" : "ml-1.5 max-w-xs opacity-100",
				)}
			>
				<span className="text-slate-900">
					Sistema de <span className="font-bold text-primary">Investigación</span>
				</span>
			</div>
		</div>
	);
}
