import { toString } from "mdast-util-to-string" // ← добавлено
import { serialize } from "next-mdx-remote/serialize"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeExternalLinks from "rehype-external-links"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import remarkSmartypants from "remark-smartypants"
import remarkToc from "remark-toc"
import { visit } from "unist-util-visit"

import remarkBlockquote from "./remarkBlockquote"

export type TocNode = {
	depth: number
	value: string
	children: TocNode[]
}

function extractHeadings() {
	const flat: { depth: number; value: string }[] = []
	return [
		() => (tree: any) => {
			visit(tree, "heading", (node: any) => {
				const text = toString(node)
				flat.push({ depth: node.depth, value: text })
			})
		},
		flat
	] as const
}

function buildTree(flat: { depth: number; value: string }[]): TocNode[] {
	const root: TocNode[] = []
	const stack: TocNode[] = []
	for (const h of flat) {
		const node: TocNode = { ...h, children: [] }
		while (stack.length && stack[stack.length - 1].depth >= h.depth) stack.pop()
		if (stack.length === 0) root.push(node)
		else stack[stack.length - 1].children.push(node)
		stack.push(node)
	}
	return root
}

export async function mdxSerialize(content: string) {
	const [extractPlugin, flat] = extractHeadings()
	const mdx = await serialize(content, {
		mdxOptions: {
			remarkPlugins: [remarkGfm, remarkSmartypants, [remarkToc, { heading: "toc" }], remarkBlockquote, extractPlugin],
			rehypePlugins: [
				rehypeSlug,
				[
					rehypeAutolinkHeadings,
					{
						behavior: "wrap", // заголовок не оборачивается
						properties: {
							ariaHidden: true,
							tabIndex: -1
						}
					}
				],
				[rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }]
			]
		}
	})

	const toc = buildTree(flat)
	return { mdx, toc }
}
