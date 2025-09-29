"use client"

import { useRouter } from "next/navigation"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { Input, Textarea, Button, Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components"
import { useCreatePostMutation, CreatePostInput } from "@/graphql"
import { useToken } from "@/providers"

export const schema = z.object({
	title: z.string().min(3),
	description: z.string().min(5),
	content: z.string().min(10),
	tags: z.string().optional()
})
export type Values = z.infer<typeof schema>

type Props = {
	onContentChange?: (value: string) => void
	form: UseFormReturn<Values>
}

export function CreatePostForm({ onContentChange, form }: Props) {
	const [createPost, { loading }] = useCreatePostMutation()
	const router = useRouter()
	const token = useToken()

	async function onSubmit(values: Values) {
		const input: CreatePostInput = {
			title: values.title,
			description: values.description,
			content: values.content,
			tags: values.tags ? values.tags.split(",").map(t => t.trim()) : []
		}

		try {
			await createPost({
				variables: { data: input },
				context: token ? { headers: { token: `Bearer ${token}` } } : undefined
			})
			form.reset()
			router.push("/admin")
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			const message = err?.graphQLErrors?.[0]?.message || err?.message || "Не удалось создать пост"
			form.setError("root", { type: "server", message })
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="max-w-xl">
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
						<FormItem className="max-w-2xl">
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
								<Textarea
									className="min-h-96"
									rows={6}
									{...field}
									onChange={e => {
										field.onChange(e)
										onContentChange?.(e.target.value)
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem className="max-w-lg">
							<FormLabel>Tags (через запятую)</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* глобальная ошибка */}
				{form.formState.errors.root && <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>}
				<Button type="submit" disabled={loading}>
					{loading ? "Создание..." : "Создать пост"}
				</Button>
			</form>
		</Form>
	)
}
