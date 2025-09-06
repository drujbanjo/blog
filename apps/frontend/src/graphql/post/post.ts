import { gql } from "@apollo/client"

export const GET_POST = gql`
	query GetPost($id: String!) {
		post(id: $id) {
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
