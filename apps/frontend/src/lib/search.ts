import { Post } from "@repo/types"

export const searchPosts = (posts: Post[], search: string) => {
	if (posts) return []
	const query = search.toLowerCase()
	return posts.filter(
		(post: Post) =>
			post.title.toLowerCase().includes(query) ||
			post.description.toLowerCase().includes(query) ||
			post.content.toLowerCase().includes(query) ||
			post.tags.some((tag: string) => tag.toLowerCase().includes(query))
	)
}
