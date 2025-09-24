import GithubSlugger from "github-slugger"
import Link from "next/link"

import { cn } from "@/lib"
import { TocNode } from "@/lib/mdx"

export const Toc = ({ toc }: { toc: TocNode[] }) => {
	const slugger = new GithubSlugger()

	const render = (nodes: TocNode[]) => (
		<ul className="before:from-border/60 before:to-border/20 relative space-y-1 before:absolute before:top-0 before:bottom-0 before:left-2 before:w-px before:bg-gradient-to-b">
			{nodes.map((n, i) => (
				<li
					key={i}
					className={cn(
						"before:bg-border/30 hover:before:bg-primary/50 relative pl-6 before:absolute before:top-0 before:left-2 before:h-full before:w-px",
						n.depth === 2 && "ml-0",
						n.depth === 3 && "ml-2",
						n.depth === 4 && "ml-4",
						n.depth > 4 && "ml-6"
					)}
				>
					<Link
						href={`#${slugger.slug(n.value)}`}
						className="group text-muted-foreground hover:text-primary block text-sm transition-colors"
					>
						<span className="group-hover:bg-primary/10 relative inline-block rounded px-1 py-0.5">{n.value}</span>
					</Link>
					{n.children.length > 0 && render(n.children)}
				</li>
			))}
		</ul>
	)

	return (
		<aside className="sticky top-20 h-[calc(100vh-5rem)] w-full max-w-64 shrink-0 overflow-y-auto backdrop-blur">
			<div className="border-border/50 from-background/95 to-background/70 rounded-xl border bg-gradient-to-b px-5 py-6 shadow-md">
				<p className="text-foreground mb-4 text-base font-semibold tracking-tight">Содержание</p>
				{render(toc)}
			</div>
		</aside>
	)
}
