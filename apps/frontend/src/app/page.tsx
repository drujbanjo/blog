"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Container,
	Input
} from "@/components"
import { Post, useGetPostsQuery } from "@/graphql"

const Home = () => {
	const { data, loading, error } = useGetPostsQuery()
	const [search, setSearch] = useState("")

	const posts = useMemo(() => {
		if (!data?.posts) return []
		const query = search.toLowerCase()
		return data.posts.filter(
			(post: Post) =>
				post.title.toLowerCase().includes(query) ||
				post.description.toLowerCase().includes(query) ||
				post.content.toLowerCase().includes(query) ||
				post.tags.some((tag: string) => tag.toLowerCase().includes(query))
		)
	}, [data, search])

	return (
		<Container size={"lg"}>
			<Input
				value={search}
				onChange={e => setSearch(e.target.value)}
				placeholder="Search..."
				className="mb-4 max-w-2xl"
			/>
			{loading ? (
				<p>Загрузка...</p>
			) : error ? (
				<p>Ошибка: {error.message}</p>
			) : (
				<ul className="grid grid-cols-3 gap-4">
					{posts.map((post: Post) => (
						<Item key={post.id} post={post} />
					))}
				</ul>
			)}
		</Container>
	)
}

const Item = ({ post }: { post: Post }) => {
	return (
		<li key={post.id}>
			<Link href={`/posts/${post.id}`} className="no-underline">
				<Card>
					<CardHeader>
						<CardTitle>{post.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription>{post.description}</CardDescription>
					</CardContent>
					<CardFooter>
						<div className="flex items-center gap-2">
							{post.tags.map((tag: string, idx: number) => (
								<CardDescription key={idx}>
									<Badge>{tag}</Badge>
								</CardDescription>
							))}
						</div>
					</CardFooter>
				</Card>
			</Link>
		</li>
	)
}

export default Home
