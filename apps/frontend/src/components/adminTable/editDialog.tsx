import { Table } from "@tanstack/react-table"
import { Dispatch, SetStateAction } from "react"

import { EditState } from "./adminTable"

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Input, Textarea } from "@/components"
import { Post, UpdatePostInput, useUpdatePostMutation } from "@/graphql"
import { cn } from "@/lib"

type Props = {
	editing: EditState
	setEditing: Dispatch<SetStateAction<EditState>>
	table: Table<Post>
	onReload: () => void
}

export function EditDialog({ editing, setEditing, table, onReload }: Props) {
	const [updatePost] = useUpdatePostMutation()

	const handleSave = async () => {
		if (!editing) return

		const row = table.getRowModel().rows.find(r => r.id === editing.rowId)
		if (!row) return

		const postId = row.original.id
		const field = editing.colId as keyof UpdatePostInput
		const value = editing.value

		try {
			await updatePost({
				variables: {
					id: postId,
					data: {
						[field]: field === "tags" ? value.split(",").map(t => t.trim()) : value
					}
				}
			})
			onReload()
		} catch (e) {
			console.error(e)
		} finally {
			setEditing(null)
		}
	}

	return (
		<Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
			<DialogContent className={cn(editing?.colId === "content" && "sm:max-w-3xl")}>
				<DialogHeader>
					<DialogTitle>Edit {editing?.colId}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					{editing?.colId === "content" ? (
						<Textarea
							className="min-h-96"
							value={editing?.value}
							onChange={e => setEditing(prev => prev && { ...prev, value: e.target.value })}
						/>
					) : (
						<Input
							value={editing?.value}
							onChange={e => setEditing(prev => prev && { ...prev, value: e.target.value })}
						/>
					)}
					<DialogFooter>
						<Button onClick={handleSave}>Save</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	)
}
