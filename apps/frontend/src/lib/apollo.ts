import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"

const httpLink = createHttpLink({
	uri: "/api/graphql", // ← Используем наш Next.js API route
	credentials: "same-origin" // ← Меняем на same-origin
})

export const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache()
})
