"use client"

import { Reference, StoreObject } from "@apollo/client"
import { useState } from "react"

import { AdminTable, Container } from "@/components"
import { useDeletePostsMutation, useGetPostsQuery } from "@/graphql"

export default function AdminPage() {
	const { data, refetch } = useGetPostsQuery()
	const [deletePosts] = useDeletePostsMutation()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleDelete(ids: string[]) {
		setError(null)
		setLoading(true)
		// оптимистично убираем из UI
		try {
			await deletePosts({
				variables: { ids },
				// опционально: Apollo cache update
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
			console.error(e)
			setError("Не удалось удалить записи")
			// при неудаче возвращаем предыдущее состояние
			await refetch()
		} finally {
			setLoading(false)
		}
	}

	return (
		<Container size="lg">
			{error && <div className="mb-2 text-red-500">{error}</div>}
			<AdminTable onReload={() => refetch()} data={data?.posts ?? []} onDelete={handleDelete} loading={loading} />
		</Container>
	)
}
