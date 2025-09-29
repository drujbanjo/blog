"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import debounce from "lodash.debounce"
import { MDXRemoteSerializeResult } from "next-mdx-remote"
import { useState, useMemo, useCallback } from "react"
import { useForm } from "react-hook-form"

import {
	Container,
	TabsContent,
	TabsList,
	TabsTrigger,
	CreatePostForm,
	Tabs,
	Markdown,
	Values,
	schema
} from "@/components"
import { mdxSerialize } from "@/lib/mdx"

export default function CreatePostPage() {
	const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)
	const form = useForm<Values>({
		resolver: zodResolver(schema),
		defaultValues: { title: "", description: "", content: "", tags: "" }
	})

	const serializeContent = useCallback(async (value: string) => {
		if (!value) {
			setMdxSource(null)
			return
		}
		try {
			const res = await mdxSerialize(value)
			setMdxSource(res.mdx)
		} catch (err) {
			console.error("MDX serialize error:", err)
			setMdxSource(null)
		}
	}, [])

	// 300 мс задержка между изменениями
	const debouncedSerialize = useMemo(() => debounce(serializeContent, 300), [serializeContent])

	function handleContentChange(value: string) {
		debouncedSerialize(value)
	}

	return (
		<Container>
			<h1 className="text-center text-7xl font-black">Create Post</h1>
			<Tabs defaultValue="form">
				<TabsList>
					<TabsTrigger value="form">Form</TabsTrigger>
					<TabsTrigger value="content">Content</TabsTrigger>
				</TabsList>
				<TabsContent value="form">
					<CreatePostForm form={form} onContentChange={handleContentChange} />
				</TabsContent>
				<TabsContent value="content">{mdxSource ? <Markdown mdx={mdxSource} /> : null}</TabsContent>
			</Tabs>
		</Container>
	)
}
