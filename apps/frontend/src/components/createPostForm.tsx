"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input, Textarea, Button, Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components"
import { useCreatePostMutation, CreatePostInput } from "@/graphql" // путь к сгенерированным типам

const schema = z.object({
	title: z.string().min(3),
	description: z.string().min(5),
	content: z.string().min(10),
	tags: z.string().optional()
})
type Values = z.infer<typeof schema>

export default function CreatePostForm() {
	const [createPost, { loading }] = useCreatePostMutation()
	const form = useForm<Values>({
		resolver: zodResolver(schema),
		defaultValues: { title: "", description: "", content: "", tags: "" }
	})

	async function onSubmit(data: Values) {
		const input: CreatePostInput = {
			title: data.title,
			description: data.description,
			content: data.content,
			tags: data.tags ? data.tags.split(",").map(t => t.trim()) : []
		}
		await createPost({
			variables: { data: input }
			// refetchQueries: ["GetPosts"] при необходимости обновления списка
		})
		form.reset()
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-4">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<Textarea rows={6} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tags (через запятую)</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={loading}>
					{loading ? "Создание..." : "Создать пост"}
				</Button>
			</form>
		</Form>
	)
}
