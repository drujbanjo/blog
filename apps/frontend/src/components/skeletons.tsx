import { Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components"

export const HomeSkeleton = () => {
	return (
		<ul className="grid grid-cols-3 gap-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<li key={i}>
					<div className="bg-card space-y-3 rounded-lg border p-4">
						<Skeleton className="h-6 w-3/4" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						<div className="flex gap-2">
							<Skeleton className="h-5 w-12 rounded-full" />
							<Skeleton className="h-5 w-12 rounded-full" />
						</div>
					</div>
				</li>
			))}
		</ul>
	)
}

export const AdminSkeleton = () => {
	return (
		<div className="space-y-2 space-x-2">
			{/* Верхняя панель с кнопками */}
			<div className="flex gap-2">
				<Skeleton className="h-8 w-16" /> {/* Sort */}
				<Skeleton className="h-8 w-20" /> {/* Columns */}
				<Skeleton className="h-8 w-16" /> {/* Create */}
				<Skeleton className="h-8 w-24" /> {/* Delete */}
				<Skeleton className="h-8 w-8 rounded-md" /> {/* Reload */}
			</div>

			{/* Таблица */}
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						<TableRow className="grid grid-cols-7 border-b">
							{Array.from({ length: 7 }).map((_, i) => (
								<TableHead key={i} className="flex items-center gap-2 border-r last:border-r-0">
									<Skeleton className="h-4 w-20" />
								</TableHead>
							))}
						</TableRow>
					</TableHeader>

					<TableBody>
						{Array.from({ length: 3 }).map((_, rowIdx) => (
							<TableRow key={rowIdx} className="grid grid-cols-7">
								{Array.from({ length: 7 }).map((_, colIdx) => (
									<TableCell key={colIdx} className="border-r last:border-r-0">
										<Skeleton className="h-4 w-full" />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
