"use client"

import { useParams } from "next/navigation"
import { MDXRemoteSerializeResult } from "next-mdx-remote"
import React, { useEffect, useState } from "react"

import { Markdown, Badge, Container } from "@/components"
import { useGetPostQuery } from "@/graphql"
import { mdxSerialize } from "@/lib/mdx"

const Page = () => {
	const params = useParams() as { id: string }

	const { data, loading, error } = useGetPostQuery({
		variables: { id: params.id }
	})

	const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)

	useEffect(() => {
		if (data?.post?.content) {
			mdxSerialize(data.post.content).then(res => setMdxSource(res))
		}
	}, [data])

	return (
		<Container>
			<div className="mb-4">
				<h1 className="mb-2 text-5xl font-black">{data?.post?.title}</h1>
				<ul className="align-center flex gap-2">
					{data?.post?.tags?.map((tag, idx) => (
						<Badge key={idx} variant="secondary">
							{tag}
						</Badge>
					))}
				</ul>
			</div>
			{loading || !mdxSource ? (
				<p>Загрузка...</p>
			) : error ? (
				<p>Ошибка: {error.message}</p>
			) : (
				<Markdown mdx={mdxSource!} />
			)}
		</Container>
	)
}

export default Page
