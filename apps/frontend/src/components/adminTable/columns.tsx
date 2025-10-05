import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components"
import { Post } from "@/graphql"

export const columns: ColumnDef<Post>[] = [
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
			<Checkbox checked={row.getIsSelected()} onCheckedChange={v => row.toggleSelected(!!v)} aria-label="Select row" />
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
