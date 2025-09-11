"use client"

import { ApolloProvider } from "./apollo"
import { ThemeProvider } from "./theme"

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ApolloProvider>
			<ThemeProvider>{children}</ThemeProvider>
		</ApolloProvider>
	)
}
