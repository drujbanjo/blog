"use client"

import { useQuery } from "@apollo/client"
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import React, { useEffect, useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark as baseTheme } from "react-syntax-highlighter/dist/cjs/styles/prism"
import remarkGfm from "remark-gfm"

import { GET_POST } from "@/graphql"

// Catppuccin Mocha цвета (только токены)
const catppuccinMocha = {
	...baseTheme,
	comment: { color: "#6c7086", fontStyle: "italic" },
	keyword: { color: "#cba6f7" },
	string: { color: "#a6e3a1" },
	function: { color: "#89b4fa" },
	number: { color: "#fab387" },
	boolean: { color: "#f38ba8" },
	operator: { color: "#94e2d5" },
	variable: { color: "#f2cdcd" },
	"class-name": { color: "#f9e2af" },
	punctuation: { color: "#bac2de" }
}

type Props = { params: { id: string } }

export default function Page({ params }: Props) {
	const { id } = params
	const { data } = useQuery(GET_POST, { variables: { id } })
	const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)

	useEffect(() => {
		if (data?.post?.content) {
			serialize(data.post.content, { mdxOptions: { remarkPlugins: [remarkGfm] } }).then(res => setMdxSource(res))
		}
	}, [data])

	if (!mdxSource) return <div>Loading...</div>

	const components = {
		code: ({ className, children, ...props }: any) => {
			const code = String(children).trim()
			if (!className) {
				return <code className="rounded bg-neutral-200 px-1 py-0.5 font-mono text-sm dark:bg-neutral-800">{code}</code>
			}
			const language = className.replace("language-", "")
			return (
				<SyntaxHighlighter
					language={language}
					style={catppuccinMocha as any}
					PreTag="pre"
					showLineNumbers
					wrapLongLines
					{...props}
				>
					{code}
				</SyntaxHighlighter>
			)
		}
	}

	return (
		<div className="prose dark:prose-invert max-w-full p-4">
			<MDXRemote {...mdxSource} components={components} />
		</div>
	)
}
