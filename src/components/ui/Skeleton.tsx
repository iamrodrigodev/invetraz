import type React from "react";
import { cn } from "../../utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
	return (
		<div
			className={cn("animate-pulse rounded-2xl bg-slate-200/80", className)}
			aria-hidden="true"
			{...props}
		/>
	);
}

export interface PageSkeletonProps {
	className?: string;
}

export function PageSkeleton({ className }: PageSkeletonProps = {}) {
	return (
		<div
			className={cn(
				"flex h-full min-h-[450px] w-full flex-1 flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-white p-8 text-center shadow-xs md:p-12",
				className,
			)}
			role="status"
			aria-busy="true"
			aria-label="Cargando contenido..."
		>
			<Skeleton className="mb-6 h-14 w-14 rounded-2xl" />
			<Skeleton className="mb-3 h-8 w-64 rounded-xl md:w-80" />
			<div className="flex w-full max-w-md flex-col items-center gap-2">
				<Skeleton className="h-4 w-full rounded-lg" />
				<Skeleton className="h-4 w-3/4 rounded-lg" />
			</div>
		</div>
	);
}

export interface AuthCardSkeletonProps {
	esSetup?: boolean;
}

export function AuthCardSkeleton({ esSetup }: AuthCardSkeletonProps = {}) {
	const isSetup =
		esSetup ??
		(typeof window !== "undefined" && window.location.pathname !== "/login");

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 font-sans">
			<div className="w-full max-w-120 rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xs md:p-12">
				<div className="mb-8 flex flex-col items-center text-center">
					<Skeleton className="mb-4 h-14 w-14 rounded-2xl" />
					<Skeleton className="mb-2 h-8 w-64 rounded-xl md:w-72" />
					<Skeleton className="h-4 w-56 rounded-md md:w-64" />
				</div>

				<div className="space-y-6">
					<div>
						<Skeleton className="mb-2 h-4 w-32 rounded-md" />
						<Skeleton className="h-10 w-full rounded-lg" />
					</div>
					<div>
						<Skeleton className="mb-2 h-4 w-24 rounded-md" />
						<Skeleton className="h-10 w-full rounded-lg" />
						{isSetup && <Skeleton className="mt-1.5 h-3 w-52 rounded-md" />}
					</div>
					{isSetup && (
						<div>
							<Skeleton className="mb-2 h-4 w-36 rounded-md" />
							<Skeleton className="h-10 w-full rounded-lg" />
						</div>
					)}
					<Skeleton className="mt-2 h-11 w-full rounded-xl" />
				</div>
			</div>
		</div>
	);
}

export function ConfiguracionSkeleton() {
	return (
		<div className="space-y-6">
			<div>
				<Skeleton className="h-8 w-72 rounded-lg" />
				<Skeleton className="mt-2 h-4 w-96 rounded-md" />
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
					<div>
						<div className="border-b border-slate-100 pb-5">
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<Skeleton className="h-5 w-44 rounded-md" />
								<Skeleton className="h-6 w-36 rounded-full" />
							</div>
							<Skeleton className="mt-3 h-6 w-56 rounded-md" />
							<Skeleton className="mt-1.5 h-4 w-80 rounded-md" />
						</div>
						<div className="space-y-5 pt-5">
							<div className="space-y-1.5">
								<Skeleton className="h-4 w-28 rounded-md" />
								<Skeleton className="h-10 w-full rounded-lg" />
								<Skeleton className="h-3.5 w-64 rounded-md" />
							</div>
							<div className="space-y-1.5">
								<Skeleton className="h-4 w-36 rounded-md" />
								<Skeleton className="h-10 w-full rounded-lg" />
								<Skeleton className="h-3.5 w-52 rounded-md" />
							</div>
							<div className="space-y-1.5">
								<Skeleton className="h-4 w-36 rounded-md" />
								<Skeleton className="h-10 w-full rounded-lg" />
								<Skeleton className="h-3.5 w-56 rounded-md" />
							</div>
						</div>
					</div>
					<div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:items-center sm:justify-end">
						<Skeleton className="h-10 w-full sm:w-36 rounded-lg" />
						<Skeleton className="h-10 w-full sm:w-44 rounded-lg" />
					</div>
				</div>

				<div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
					<div>
						<div className="border-b border-slate-100 pb-5">
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<Skeleton className="h-5 w-36 rounded-md" />
								<Skeleton className="h-6 w-36 rounded-full" />
							</div>
							<Skeleton className="mt-3 h-6 w-64 rounded-md" />
							<Skeleton className="mt-1.5 h-4 w-96 rounded-md" />
						</div>
						<div className="space-y-5 pt-5">
							<div className="space-y-1.5">
								<Skeleton className="h-4 w-56 rounded-md" />
								<Skeleton className="h-10 w-full rounded-lg" />
								<Skeleton className="h-3.5 w-80 rounded-md" />
							</div>
						</div>
					</div>
					<div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:items-center sm:justify-end">
						<Skeleton className="h-10 w-full sm:w-36 rounded-lg" />
						<Skeleton className="h-10 w-full sm:w-44 rounded-lg" />
					</div>
				</div>
			</div>
		</div>
	);
}

export function DocumentacionSkeleton() {
	return (
		<div className="space-y-6 pb-12 w-full">
			<div>
				<div className="flex items-center gap-2.5 mb-1">
					<Skeleton className="h-6 w-6 rounded-md" />
					<Skeleton className="h-8 w-80 rounded-lg" />
				</div>
				<Skeleton className="mt-2 h-4 w-96 rounded-md" />
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
					<div className="space-y-4">
						<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
							<Skeleton className="h-5 w-5 rounded-md" />
							<Skeleton className="h-5 w-64 rounded-md" />
						</div>
						<div className="space-y-3 pt-1">
							<Skeleton className="h-3.5 w-4/5 rounded-md" />
							<Skeleton className="h-3.5 w-11/12 rounded-md" />
							<Skeleton className="h-3.5 w-3/4 rounded-md" />
							<div className="space-y-1.5">
								<Skeleton className="h-3.5 w-2/3 rounded-md" />
								<div className="flex items-center gap-2 mt-1">
									<Skeleton className="h-8 flex-1 rounded-md" />
									<Skeleton className="h-8 w-20 shrink-0 rounded-md" />
								</div>
							</div>
							<Skeleton className="h-3.5 w-4/5 rounded-md" />
						</div>
					</div>
					<div className="pt-2">
						<Skeleton className="h-9 w-56 rounded-lg" />
					</div>
				</div>

				<div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
					<div className="space-y-4">
						<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
							<Skeleton className="h-5 w-5 rounded-md" />
							<Skeleton className="h-5 w-52 rounded-md" />
						</div>
						<div className="space-y-3 pt-1">
							<Skeleton className="h-3.5 w-11/12 rounded-md" />
							<Skeleton className="h-4 w-52 rounded-md" />
							<div className="space-y-2.5">
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<Skeleton className="h-3.5 w-28 rounded-md" />
										<Skeleton className="h-6 w-16 rounded-md" />
									</div>
									<Skeleton className="h-7 w-full rounded-md" />
								</div>
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<Skeleton className="h-3.5 w-36 rounded-md" />
										<Skeleton className="h-6 w-16 rounded-md" />
									</div>
									<Skeleton className="h-7 w-full rounded-md" />
								</div>
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<Skeleton className="h-3.5 w-40 rounded-md" />
										<Skeleton className="h-6 w-16 rounded-md" />
									</div>
									<Skeleton className="h-7 w-full rounded-md" />
								</div>
							</div>
						</div>
					</div>
					<div className="pt-2">
						<Skeleton className="h-9 w-52 rounded-lg" />
					</div>
				</div>

				<div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
					<div className="space-y-4">
						<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
							<Skeleton className="h-5 w-5 rounded-md" />
							<Skeleton className="h-5 w-44 rounded-md" />
						</div>
						<div className="space-y-3 pt-1">
							<Skeleton className="h-3.5 w-11/12 rounded-md" />
							<Skeleton className="h-3.5 w-full rounded-md" />
							<div className="space-y-1.5">
								<Skeleton className="h-3.5 w-48 rounded-md" />
								<div className="flex items-center gap-2 mt-1">
									<Skeleton className="h-8 flex-1 rounded-md" />
									<Skeleton className="h-8 w-20 shrink-0 rounded-md" />
								</div>
							</div>
							<Skeleton className="h-3.5 w-5/6 rounded-md" />
						</div>
					</div>
					<div className="pt-2">
						<Skeleton className="h-9 w-44 rounded-lg" />
					</div>
				</div>

				<div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
					<div className="space-y-4">
						<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
							<Skeleton className="h-5 w-5 rounded-md" />
							<Skeleton className="h-5 w-64 rounded-md" />
						</div>
						<div className="space-y-3 pt-1">
							<Skeleton className="h-3.5 w-full rounded-md" />
							<div className="flex items-center justify-between gap-2">
								<Skeleton className="h-3.5 w-3/4 rounded-md" />
								<Skeleton className="h-6 w-16 rounded-md shrink-0" />
							</div>
							<Skeleton className="h-3.5 w-4/5 rounded-md" />
							<Skeleton className="h-3.5 w-full rounded-md" />
							<Skeleton className="h-3.5 w-3/4 rounded-md" />
						</div>
					</div>
					<div className="pt-2">
						<Skeleton className="h-9 w-52 rounded-lg" />
					</div>
				</div>
			</div>
		</div>
	);
}

export function DashboardSkeleton() {
	const estaColapsado =
		typeof window !== "undefined" &&
		localStorage.getItem("sidebar_colapsado") === "true";

	const moduloActivo =
		typeof window !== "undefined"
			? localStorage.getItem("moduloActivo") || "actividades"
			: "actividades";

	return (
		<div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-800">
			<aside
				className={cn(
					"hidden h-full flex-col border-r border-slate-200 bg-white lg:flex",
					estaColapsado ? "w-20" : "w-72",
				)}
			>
				<div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-[18px]">
					<div className="flex items-center w-full">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center">
							<Skeleton className="h-6 w-6 rounded-lg" />
						</div>
						{!estaColapsado && (
							<Skeleton className="ml-1.5 h-5 w-40 rounded-md" />
						)}
					</div>
				</div>

				<div className="flex-1 space-y-1.5 py-5 px-[18px]">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="flex h-11 w-full items-center rounded-xl">
							<div className="flex h-11 w-11 shrink-0 items-center justify-center">
								<Skeleton className="h-5 w-5 rounded-md" />
							</div>
							{!estaColapsado && (
								<Skeleton className="ml-1.5 h-4 w-32 rounded-md" />
							)}
						</div>
					))}
				</div>

				<div className="border-t border-slate-200/80 py-4 px-[18px]">
					<div className="flex h-11 w-full items-center rounded-xl">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center">
							<Skeleton className="h-5 w-5 shrink-0 rounded-md" />
						</div>
						{!estaColapsado && (
							<Skeleton className="ml-1.5 h-4 w-28 rounded-md" />
						)}
					</div>
				</div>
			</aside>

			<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
				<header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
					<Skeleton className="h-6 w-48 rounded-md" />
					<div className="flex items-center gap-3 rounded-2xl p-1.5 pr-2.5">
						<Skeleton className="h-9 w-9 shrink-0 rounded-full" />
						<div className="hidden sm:flex flex-col items-start gap-1.5 text-left">
							<Skeleton className="h-3.5 w-36 rounded-md md:w-44" />
							<Skeleton className="h-4 w-24 rounded-full" />
						</div>
						<Skeleton className="h-4 w-4 shrink-0 rounded-md" />
					</div>
				</header>

				<main className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto p-6">
					<div className="flex h-full min-h-0 w-full flex-1 flex-col">
						{moduloActivo === "configuracion" ? (
							<ConfiguracionSkeleton />
						) : moduloActivo === "documentacion" ? (
							<DocumentacionSkeleton />
						) : (
							<PageSkeleton />
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
