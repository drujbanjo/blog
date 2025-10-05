import { Table } from "@tanstack/react-table"
import { RefreshCw } from "lucide-react"
import Link from "next/link"

import {
	Button,
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	Checkbox,
	Label
} from "@/components"
import { Post } from "@/graphql"

type Props = {
	table: Table<Post>
	selectedIds: string[]
	currentDateSort: "newest" | "oldest"
	loading: boolean
	onDelete: (ids: string[]) => void
	onReload: () => void
	setSorting: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function TableToolbar({ table, selectedIds, currentDateSort, loading, onDelete, onReload, setSorting }: Props) {
	return (
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

			<Button variant="outline" size={"icon"} disabled={loading} onClick={onReload}>
				<RefreshCw />
			</Button>
		</div>
	)
}
