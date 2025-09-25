import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client"

const authLink = new ApolloLink((operation, forward) => {
	const token = localStorage.getItem("token") // или другой источник
	if (token) {
		operation.setContext(({ headers = {} }) => ({
			headers: {
				...headers,
				token // передаем токен в header
			}
		}))
	}
	return forward(operation)
})

export const client = new ApolloClient({
	link: authLink.concat(
		new HttpLink({
			uri: process.env.NEXT_PUBLIC_API!
			// credentials: "include" // не нужен, если не используем cookie
		})
	),
	cache: new InMemoryCache()
})
