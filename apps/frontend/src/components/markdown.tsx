"use client"

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import Prism from "prismjs"
import React, { ComponentProps, JSX, useEffect } from "react"

// Импортируем все языки Prism
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-css"
import "prismjs/components/prism-json"
import "prismjs/components/prism-markup"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-python"
import "prismjs/components/prism-graphql"
import "prismjs/components/prism-c"
import "prismjs/components/prism-git"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-lua"
import "prismjs/components/prism-scss"

// Подключаем CSS обеих тем
import "@/styles/prism/catppuccin-latte.css"
import "@/styles/prism/catppuccin-mocha.css"

const styled =
	<Tag extends keyof JSX.IntrinsicElements>(Tag: Tag, className: string) =>
	(props: Omit<ComponentProps<Tag>, "className">) =>
		React.createElement(Tag, { ...props, className })

type MarkdownProps = {
	mdx: MDXRemoteSerializeResult
}

export const Markdown = ({ mdx }: MarkdownProps) => {
	useEffect(() => {
		Prism.highlightAll()
	}, [])

	const components = {
		p: styled("p", "first:mt-0 mt-6"),
		h1: styled("h1", "mt-8 text-4xl font-bold"),
		h2: styled("h2", "mt-6 text-3xl font-bold"),
		h3: styled("h3", "mt-5 text-2xl font-bold"),
		h4: styled("h4", "mt-4 text-xl font-bold"),
		ul: styled("ul", "my-8 pl-8 list-inside list-disc space-y-2"),
		ol: styled("ol", "my-8 pl-8 list-inside list-decimal space-y-2"),

		code: ({ className, children, ...props }: any) => {
			const code = String(children).trim()
			if (!className) {
				return <code className="rounded px-1 py-0.5 font-mono text-inherit">{code}</code>
			}

			const language = className.replace("language-", "")
			return (
				<pre className={`mt-4 overflow-x-auto rounded-md p-4 font-mono`}>
					<code className={`language-${language} font-mono`} {...props}>
						{code}
					</code>
				</pre>
			)
		}
	}

	return (
		<div className="prose dark:prose-invert max-w-full py-4">
			<MDXRemote {...mdx} components={components} />
		</div>
	)
}
