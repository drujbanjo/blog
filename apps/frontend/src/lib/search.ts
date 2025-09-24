import { Post } from "@/graphql"

export const searchPosts = (posts: Post[] | undefined, search: string): Post[] => {
	if (!posts || posts.length === 0) return []
	const query = search.toLowerCase()
	return posts.filter(
		post =>
			post.title.toLowerCase().includes(query) ||
			post.description.toLowerCase().includes(query) ||
			post.content.toLowerCase().includes(query) ||
			post.tags.some(tag => tag.toLowerCase().includes(query))
	)
}
