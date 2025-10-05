"use client"

import { getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { useState } from "react"

import { columns } from "./columns"
import { EditDialog } from "./editDialog"
import { TableContent } from "./tableContent"
import { TableToolbar } from "./tableToolbar"

import { Post } from "@/graphql"

type Props = {
	data: Post[]
	onDelete: (ids: string[]) => void
	onReload: () => void
	loading: boolean
}

export type EditState = { rowId: string; colId: string; value: string } | null

export function AdminTable({ data, onDelete, onReload, loading }: Props) {
	const [sorting, setSorting] = useState([{ id: "createdAt", desc: true }])
	const [columnVisibility, setColumnVisibility] = useState({} as Record<string, boolean>)
	const [editing, setEditing] = useState<EditState>(null)
	const [rowSelection, setRowSelection] = useState({})

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
	const currentDateSort = sorting[0]?.desc ? "newest" : "oldest"

	return (
		<>
			<div className="space-y-2 space-x-2">
				<TableToolbar
					table={table}
					selectedIds={selectedIds}
					currentDateSort={currentDateSort}
					loading={loading}
					onDelete={onDelete}
					onReload={onReload}
					setSorting={setSorting}
				/>

				<TableContent table={table} setEditing={setEditing} />
			</div>

			<EditDialog editing={editing} setEditing={setEditing} table={table} onReload={onReload} />
		</>
	)
}
