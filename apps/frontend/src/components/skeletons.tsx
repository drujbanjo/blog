import { Skeleton } from "@/components/ui/skeleton"

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
