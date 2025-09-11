"use client"

import { Contrast } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui/button"

export const ThemeToggle = () => {
	const { theme, setTheme } = useTheme()
	return (
		<Button onClick={() => setTheme(theme == "dark" ? "light" : "dark")} size={"icon"} variant={"secondary"}>
			<Contrast />
		</Button>
	)
}
