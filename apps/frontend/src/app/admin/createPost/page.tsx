"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import debounce from "lodash.debounce"
import { MDXRemoteSerializeResult } from "next-mdx-remote"
import { useState, useMemo, useCallback, useEffect } from "react"
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
	const [serializeError, setSerializeError] = useState<string | null>(null)

	const form = useForm<Values>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: "",
			description: "",
			content: "",
			tags: ""
		}
	})

	const serializeContent = useCallback(async (value: string) => {
		if (!value) {
			setMdxSource(null)
			setSerializeError(null)
			return
		}

		try {
			const res = await mdxSerialize(value)
			setMdxSource(res.mdx)
			setSerializeError(null)
		} catch (err) {
			console.error("MDX serialize error:", err)
			setSerializeError(err instanceof Error ? err.message : "Failed to render preview")
			setMdxSource(null)
		}
	}, [])

	// 300ms debounce для оптимизации
	const debouncedSerialize = useMemo(() => debounce(serializeContent, 300), [serializeContent])

	function handleContentChange(value: string) {
		debouncedSerialize(value)
	}

	// Cleanup debounce on unmount
	useEffect(() => {
		return () => {
			debouncedSerialize.cancel()
		}
	}, [debouncedSerialize])

	return (
		<Container>
			<h1 className="mb-8 text-center text-5xl font-black">Create Post</h1>

			<Tabs defaultValue="form" className="w-full">
				<TabsList className="mb-4">
					<TabsTrigger value="form">Edit</TabsTrigger>
					<TabsTrigger value="content">Preview</TabsTrigger>
				</TabsList>

				<TabsContent value="form">
					<CreatePostForm form={form} onContentChange={handleContentChange} />
				</TabsContent>

				<TabsContent value="content">
					{serializeError ? (
						<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
							<h3 className="mb-2 font-bold text-yellow-800">Preview Error</h3>
							<p className="text-yellow-700">{serializeError}</p>
						</div>
					) : mdxSource ? (
						<div className="rounded-lg border border-gray-200 bg-white p-8">
							<Markdown mdx={mdxSource} />
						</div>
					) : (
						<div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center text-gray-500">
							Start writing content to see preview
						</div>
					)}
				</TabsContent>
			</Tabs>
		</Container>
	)
}
