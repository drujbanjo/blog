import { gql } from "@apollo/client"

export const GET_POSTS = gql`
	query GetPosts($query: String) {
		posts(query: $query) {
			id
			title
			description
			content
			tags
			createdAt
			updatedAt
		}
	}
`
