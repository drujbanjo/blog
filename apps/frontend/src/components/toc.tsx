import GithubSlugger from "github-slugger"
import Link from "next/link"

import { cn } from "@/lib"
import { TocNode } from "@/lib/mdx"

export function Toc({ toc }: { toc: TocNode[] }) {
	const slugger = new GithubSlugger()

	const render = (nodes: TocNode[]) => (
		<ul className="space-y-1">
			{nodes.map((n, i) => (
				<li
					key={i}
					className={cn(
						"truncate",
						n.depth === 2 && "pl-3",
						n.depth === 3 && "pl-4",
						n.depth === 4 && "pl-5",
						n.depth > 4 && "pl-5"
					)}
				>
					<Link
						href={`#${slugger.slug(n.value)}`}
						className="hover:text-primary text-md text-primary/85 my-1 block transition-colors"
					>
						{n.value}
					</Link>
					{n.children.length > 0 && render(n.children)}
				</li>
			))}
		</ul>
	)

	return (
		<nav className="sticky top-20 max-h-[calc(100vh-5rem)] space-y-2 overflow-y-auto">
			<p className="mb-2 font-semibold">Содержание</p>
			{render(toc)}
		</nav>
	)
}
