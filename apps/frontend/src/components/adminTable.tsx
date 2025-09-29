"use client"

import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	Button,
	Checkbox,
	Label,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	Input,
	Textarea
} from "@/components"
import { Post, UpdatePostInput, useUpdatePostMutation } from "@/graphql"
import { cn } from "@/lib"

type Props = { data: Post[]; onDelete: (ids: string[]) => void; onReload: () => void; loading: boolean }
type EditState = { rowId: string; colId: string; value: string } | null

export function AdminTable({ data, onDelete, onReload, loading }: Props) {
	const [sorting, setSorting] = useState([{ id: "createdAt", desc: true }])
	const [columnVisibility, setColumnVisibility] = useState({} as Record<string, boolean>)
	const [editing, setEditing] = useState<EditState>(null)
	const [rowSelection, setRowSelection] = useState({})
	const [updatePost] = useUpdatePostMutation()

	const nonEditable = new Set(["id", "createdAt", "updatedAt"])

	const columns: ColumnDef<Post>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={v => table.toggleAllPageRowsSelected(!!v)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={v => row.toggleSelected(!!v)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false
		},
		{ id: "id", accessorKey: "id", header: "Id", meta: { type: "string" } },
		{ id: "title", accessorKey: "title", header: "Title", meta: { type: "string" } },
		{ id: "description", accessorKey: "description", header: "Description", meta: { type: "string" } },
		{ id: "content", accessorKey: "content", header: "Content", meta: { type: "string" } },
		{ id: "tags", accessorKey: "tags", header: "Tags", meta: { type: "string[]" } },
		{
			id: "createdAt",
			accessorKey: "createdAt",
			header: "Created At",
			meta: { type: "Date" },
			cell: ({ row }) => new Date(row.original.createdAt).toLocaleString()
		},
		{
			id: "updatedAt",
			accessorKey: "updatedAt",
			header: "Updated At",
			meta: { type: "Date" },
			cell: ({ row }) => new Date(row.original.updatedAt).toLocaleString()
		}
	]

	const table = useReactTable({
		data,
		columns,
		state: { sorting, columnVisibility, rowSelection },
		onColumnVisibilityChange: setColumnVisibility,
		onSortingChange: setSorting,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	})

	const selectedIds = table.getSelectedRowModel().rows.map(r => r.original.id)

	const gridTemplate = table
		.getVisibleLeafColumns()
		.map(col => (col.id === "select" ? "auto" : "minmax(0,1fr)"))
		.join(" ")

	const currentDateSort = sorting[0]?.desc ? "newest" : "oldest"

	return (
		<>
			<div className="space-y-2 space-x-2">
				<div className="flex gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">Sort</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								className={currentDateSort === "newest" ? "bg-muted" : ""}
								onClick={() => setSorting([{ id: "createdAt", desc: true }])}
							>
								Newest
							</DropdownMenuItem>
							<DropdownMenuItem
								className={currentDateSort === "oldest" ? "bg-muted" : ""}
								onClick={() => setSorting([{ id: "createdAt", desc: false }])}
							>
								Oldest
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">Columns</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="p-2">
							{table
								.getAllLeafColumns()
								.filter(c => c.id !== "select")
								.map(col => (
									<DropdownMenuItem key={col.id} className="flex items-center gap-2" asChild>
										<Label htmlFor={col.id}>
											<Checkbox
												checked={col.getIsVisible()}
												onCheckedChange={checked => col.toggleVisibility(!!checked)}
												id={col.id}
											/>
											<span>{typeof col.columnDef.header === "string" ? col.columnDef.header : String(col.id)}</span>
										</Label>
									</DropdownMenuItem>
								))}
						</DropdownMenuContent>
					</DropdownMenu>

					<Button asChild>
						<Link href="/admin/createPost">Create</Link>
					</Button>
					{selectedIds.length !== 0 && (
						<Button variant="destructive" disabled={loading} onClick={() => onDelete(selectedIds)}>
							Delete ({selectedIds.length})
						</Button>
					)}

					<Button variant="outline" size={"icon"} onClick={onReload}>
						<RefreshCw />
					</Button>
				</div>

				<div className="overflow-hidden rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map(headerGroup => (
								<TableRow key={headerGroup.id} className="grid border-b" style={{ gridTemplateColumns: gridTemplate }}>
									{headerGroup.headers.map(header =>
										header.column.getIsVisible() ? (
											<TableHead key={header.id} className="flex items-center gap-2 border-r last:border-r-0">
												{flexRender(header.column.columnDef.header, header.getContext())}
												{header.column.id !== "select" && (
													<span className="text-muted-foreground text-xs">
														{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
														{(header.column.columnDef.meta as any)?.type}
													</span>
												)}
											</TableHead>
										) : null
									)}
								</TableRow>
							))}
						</TableHeader>

						<TableBody>
							{table.getRowModel().rows.length ? (
								table.getRowModel().rows.map(row => (
									<TableRow key={row.original.id} className="grid" style={{ gridTemplateColumns: gridTemplate }}>
										{row.getVisibleCells().map(cell => {
											const colId = cell.column.id
											const isEditable = !nonEditable.has(colId) && colId !== "select"
											return (
												<TableCell
													key={cell.id}
													className={cn(
														"truncate border-r last:border-r-0",
														isEditable ? "hover:bg-muted cursor-pointer" : ""
													)}
													onClick={() => {
														if (!isEditable) return
														setEditing({
															rowId: row.original.id,
															colId,
															value: String(cell.getValue() ?? "")
														})
													}}
												>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCell>
											)
										})}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={table.getVisibleLeafColumns().length} className="text-center">
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

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
							<Button
								onClick={async () => {
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
												data: { [field]: field === "tags" ? value.split(",").map(t => t.trim()) : value }
											}
										})
										onReload()
									} catch (e) {
										console.error(e)
									} finally {
										setEditing(null)
									}
								}}
							>
								Save
							</Button>
						</DialogFooter>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}
