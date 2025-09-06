"use client"

import * as nextThemes from "next-themes"

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<nextThemes.ThemeProvider defaultTheme="system" attribute={"class"}>
			{children}
		</nextThemes.ThemeProvider>
	)
}
