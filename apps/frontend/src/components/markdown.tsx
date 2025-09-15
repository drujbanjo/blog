"use client"

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import Prism from "prismjs"
import React, { ComponentProps, JSX, useEffect } from "react"

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

import "prismjs/plugins/line-numbers/prism-line-numbers"
import "@/styles/prism/line-numbers.css"

import "@/styles/prism/catppuccin-latte.css"
import "@/styles/prism/catppuccin-mocha.css"

import { cn } from "@/lib"

const styled =
	<Tag extends keyof JSX.IntrinsicElements>(
		Tag: Tag,
		className: string,
		extraProps: Partial<ComponentProps<Tag>> = {}
	) =>
	(props: Omit<ComponentProps<Tag>, "className">) =>
		React.createElement(Tag, {
			...extraProps,
			...props,
			className
		})

type MarkdownProps = {
	mdx: MDXRemoteSerializeResult
}

export const Markdown = ({ mdx }: MarkdownProps) => {
	useEffect(() => {
		Prism.highlightAll()
	}, [mdx])

	const components = {
		p: styled("p", "first:mt-0 mt-6"),
		h1: styled("h1", "[&_a]:no-underline mt-8 text-4xl [&_*]:font-black"),
		h2: styled("h2", "[&_a]:no-underline mt-6 text-3xl [&_*]:font-extrabold"),
		h3: styled("h3", "[&_a]:no-underline mt-5 text-2xl [&_*]:font-bold"),
		h4: styled("h4", "[&_a]:no-underline mt-4 text-xl [&_*]:font-semibold"),
		h5: styled("h5", "[&_a]:no-underline mt-3 text-lg [&_*]font-bold"),
		ul: styled("ul", "my-8 pl-8 list-inside list-disc space-y-2"),
		ol: styled("ol", "my-8 pl-8 list-inside list-decimal space-y-2"),

		a: styled("a", "font-medium underline underline-offset-4 hover:text-primary"),

		blockquote: styled(
			"blockquote",
			"mt-6 relative py-3 pl-6 before:bg-border text-muted-foreground relative mt-6 py-2 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:rounded-full"
		),

		Blockquote: ({ type, children }: { type: string; children: React.ReactNode }) => (
			<blockquote
				className={`mt-6 py-3 pl-6 ${
					type === "warn"
						? "relative text-yellow-500/70 before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:rounded-full before:bg-yellow-500/70"
						: type === "note"
							? "before:bg-border text-muted-foreground relative mt-6 py-2 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:rounded-full"
							: type === "important"
								? "relative text-red-500/70 before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:rounded-full before:bg-red-500/70"
								: "before:bg-border text-muted-foreground relative mt-6 py-2 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:rounded-full"
				}`}
			>
				{children}
			</blockquote>
		),

		code: ({ className, children, ...props }: any) => {
			const code = String(children).trim()
			if (!className) {
				return <code className="language-none rounded px-1 py-0.5 font-mono text-inherit">{code}</code>
			}

			const language = className.replace("language-", "")
			return (
				<pre className={cn(`${language != "bash" && "line-numbers"} mt-4 overflow-x-auto rounded-md p-4 font-mono`)}>
					{language == "bash" && <span className="pointer-events-none pl-2 select-none">$ </span>}
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
