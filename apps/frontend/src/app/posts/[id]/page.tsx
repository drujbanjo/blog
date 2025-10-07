"use client"
import { useParams } from "next/navigation"
import { MDXRemoteSerializeResult } from "next-mdx-remote"
import React, { useEffect, useState } from "react"

import { Markdown, Badge, Container, Toc } from "@/components"
import { useGetPostQuery } from "@/graphql"
import { mdxSerialize, TocNode } from "@/lib/mdx"

const Page = () => {
	const params = useParams() as { id: string }
	const { data, loading, error } = useGetPostQuery({
		variables: { id: params.id }
	})
	const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)
	const [toc, setToc] = useState<TocNode[]>([])

	useEffect(() => {
		if (data?.post?.content) {
			mdxSerialize(data.post.content).then(res => {
				setMdxSource(res.mdx)
				setToc(res.toc)
			})
		}
	}, [data])

	// Устанавливаем title и meta-теги страницы
	useEffect(() => {
		if (data?.post?.title) {
			document.title = data.post.title

			// Устанавливаем description
			if (data?.post?.description) {
				let metaDescription = document.querySelector('meta[name="description"]')
				if (!metaDescription) {
					metaDescription = document.createElement("meta")
					metaDescription.setAttribute("name", "description")
					document.head.appendChild(metaDescription)
				}
				metaDescription.setAttribute("content", data.post.description)
			}

			// Устанавливаем keywords
			if (data?.post?.tags && data.post.tags.length > 0) {
				let metaKeywords = document.querySelector('meta[name="keywords"]')
				if (!metaKeywords) {
					metaKeywords = document.createElement("meta")
					metaKeywords.setAttribute("name", "keywords")
					document.head.appendChild(metaKeywords)
				}
				metaKeywords.setAttribute("content", data.post.tags.join(", "))
			}
		}
	}, [data?.post?.title, data?.post?.description, data?.post?.tags])

	return (
		<>
			<Container size="lg">
				<div className="mb-6">
					<h1 className="mb-2 text-5xl font-black">{data?.post?.title}</h1>
					<ul className="align-center flex gap-2">
						{data?.post?.tags?.map((tag, idx) => (
							<Badge key={idx} variant="secondary">
								{tag}
							</Badge>
						))}
					</ul>
				</div>
				<div className="grid grid-cols-5 gap-10">
					<div className="col-span-4">
						{loading || !mdxSource ? (
							<p>Загрузка...</p>
						) : error ? (
							<p>Ошибка: {error.message}</p>
						) : (
							<Markdown mdx={mdxSource!} />
						)}
					</div>
					<div className="col-span-1">
						<Toc toc={toc} />
					</div>
				</div>
			</Container>
		</>
	)
}

export default Page
