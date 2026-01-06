import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path }) =>
			console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
		)
	}
	if (networkError) {
		console.error(`[Network error]:`, networkError)
	}
})

// HTTP link - используем Next.js API route как прокси
const httpLink = createHttpLink({
	uri: "/api/graphql",
	credentials: "include", // КРИТИЧЕСКИ ВАЖНО для отправки cookies!
	fetch
})

// Auth link - добавляем дополнительные заголовки если нужно
const authLink = setContext((_, { headers }) => {
	return {
		headers: {
			...headers
			// Можно добавить дополнительные заголовки
		}
	}
})

// Создаем Apollo Client
export const client = new ApolloClient({
	link: from([errorLink, authLink, httpLink]),
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					posts: {
						// eslint-disable-next-line unused-imports/no-unused-vars
						merge(existing = [], incoming) {
							return incoming
						}
					}
				}
			}
		}
	}),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: "cache-and-network",
			errorPolicy: "all"
		},
		query: {
			fetchPolicy: "cache-first",
			errorPolicy: "all"
		},
		mutate: {
			errorPolicy: "all"
		}
	},
	// Для production отключаем devtools
	devtools: {
		enabled: process.env.NODE_ENV === "development"
	}
})
