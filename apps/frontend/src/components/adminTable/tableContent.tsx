import { flexRender, Table } from "@tanstack/react-table"
import { Dispatch, SetStateAction } from "react"

import { EditState } from "./adminTable"

import { Table as TableUI, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components"
import { Post } from "@/graphql"
import { cn } from "@/lib"

type Props = {
	table: Table<Post>
	setEditing: Dispatch<SetStateAction<EditState>>
}

const NON_EDITABLE = new Set(["id", "createdAt", "updatedAt"])

export function TableContent({ table, setEditing }: Props) {
	const gridTemplate = table
		.getVisibleLeafColumns()
		.map(col => (col.id === "select" ? "auto" : "minmax(0,1fr)"))
		.join(" ")

	return (
		<div className="overflow-hidden rounded-md border">
			<TableUI>
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
									const isEditable = !NON_EDITABLE.has(colId) && colId !== "select"

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
			</TableUI>
		</div>
	)
}
