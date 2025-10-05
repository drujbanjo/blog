import { zodResolver } from "@hookform/resolvers/zod"
import { Table } from "@tanstack/react-table"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { EditState } from "./adminTable"

import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Textarea
} from "@/components"
import { Post, UpdatePostInput, useUpdatePostMutation } from "@/graphql"
import { cn } from "@/lib"

type Props = {
	editing: EditState
	setEditing: Dispatch<SetStateAction<EditState>>
	table: Table<Post>
	onReload: () => void
}

const formSchema = z.object({
	value: z.string().min(1, "Value is required")
})

export function EditDialog({ editing, setEditing, table, onReload }: Props) {
	const [updatePost] = useUpdatePostMutation()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			value: editing?.value || ""
		},
		values: {
			value: editing?.value || ""
		}
	})

	const handleSave = async (values: z.infer<typeof formSchema>) => {
		if (!editing) {
			return
		}

		// Ищем по original.id
		const row = table.getRowModel().rows.find(r => r.original.id === editing.rowId)
		if (!row) {
			return
		}

		const postId = row.original.id
		const field = editing.colId as keyof UpdatePostInput
		const value = values.value

		const updateData =
			field === "tags"
				? {
						[field]: value
							.split(",")
							.map(t => t.trim())
							.filter(Boolean)
					}
				: { [field]: value }

		try {
			const result = await updatePost({
				variables: {
					id: postId,
					data: updateData
				},
				refetchQueries: ["GetPosts"],
				awaitRefetchQueries: true
			})

			if (result.errors) {
				return
			}

			await onReload()
			setEditing(null)
			form.reset()
		} catch (e) {
			console.error("Update error:", e)
		}
	}

	// Если editing null, не рендерим содержимое диалога
	if (!editing) {
		return (
			<Dialog open={false} onOpenChange={() => setEditing(null)}>
				<DialogContent />
			</Dialog>
		)
	}

	return (
		<Dialog
			open={true}
			onOpenChange={() => {
				setEditing(null)
				form.reset()
			}}
		>
			<DialogContent className={cn(editing.colId === "content" && "sm:max-w-3xl")}>
				<DialogHeader>
					<DialogTitle>Edit {editing.colId}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
						<FormField
							control={form.control}
							name="value"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="capitalize">{editing.colId}</FormLabel>
									<FormControl>
										{editing.colId === "content" ? <Textarea className="min-h-96" {...field} /> : <Input {...field} />}
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setEditing(null)}>
								Cancel
							</Button>
							<Button type="submit">Save</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
