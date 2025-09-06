import { Inter, JetBrains_Mono } from "next/font/google"

export const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin", "cyrillic"],
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

export const jetBrains = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin", "cyrillic"],
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800"]
})
