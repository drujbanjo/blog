import { serialize } from "next-mdx-remote/serialize"
import remarkGfm from "remark-gfm"

import remarkBlockquote from "./remarkBlockquote"

export async function mdxSerialize(content: string) {
	return await serialize(content, {
		mdxOptions: { remarkPlugins: [remarkGfm, remarkBlockquote] }
	})
}
