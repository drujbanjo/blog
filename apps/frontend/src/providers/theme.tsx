"use client"

import * as nextThemes from "next-themes"

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<nextThemes.ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			value={{
				light: "light",
				dark: "dark"
			}}
		>
			{children}
		</nextThemes.ThemeProvider>
	)
}
