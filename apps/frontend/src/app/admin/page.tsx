"use client"

import { Reference, StoreObject } from "@apollo/client"
import { useState } from "react"

import { AdminSkeleton, AdminTable, Container } from "@/components"
import { useDeletePostsMutation, useGetPostsQuery } from "@/graphql"

export default function AdminPage() {
	const {
		data,
		refetch,
		loading: queryLoading,
		error: queryError
	} = useGetPostsQuery({
		fetchPolicy: "network-only",
		context: {
			credentials: "include"
		}
	})

	const [deletePosts] = useDeletePostsMutation()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleDelete(ids: string[]) {
		setError(null)
		setLoading(true)

		try {
			await deletePosts({
				variables: { ids },
				context: {
					credentials: "include"
				},
				update(cache) {
					cache.modify({
						fields: {
							posts(existingRefs: readonly (Reference | StoreObject)[] = [], { readField }) {
								return existingRefs.filter((ref): ref is Reference => {
									const id = readField<string>("id", ref)
									return id !== undefined && !ids.includes(id)
								})
							}
						}
					})
				}
			})

			await refetch()
		} catch (e) {
			console.error("Delete error:", e)
			setError("Failed to delete posts. Please try again.")
			await refetch()
		} finally {
			setLoading(false)
		}
	}

	// Query error state
	if (queryError) {
		return (
			<Container size="lg">
				<div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
					<h2 className="mb-2 text-xl font-bold text-red-700">Error Loading Posts</h2>
					<p className="mb-4 text-red-600">{queryError.message}</p>
					<button
						className="rounded bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700"
						onClick={() => refetch()}
					>
						Retry
					</button>
				</div>
			</Container>
		)
	}

	return (
		<Container size="lg">
			{error && (
				<div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
					<p className="text-red-700">{error}</p>
				</div>
			)}

			{queryLoading ? (
				<AdminSkeleton />
			) : (
				<AdminTable onReload={() => refetch()} data={data?.posts ?? []} onDelete={handleDelete} loading={loading} />
			)}
		</Container>
	)
}
