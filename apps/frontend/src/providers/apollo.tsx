"use client"

import * as apollo from "@apollo/client"

import { client } from "@/lib/apollo"

export const ApolloProvider = ({ children }: { children: React.ReactNode }) => {
	return <apollo.ApolloProvider client={client}>{children}</apollo.ApolloProvider>
}
