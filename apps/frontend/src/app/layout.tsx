import type { Metadata } from "next"

import { Header } from "@/components"
import { inter, jetBrains } from "@/lib"
import { Providers } from "@/providers"
import "@/styles/main.css"

import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
	title: {
		default: "drujban's blog",
		template: "%s | drujban's blog"
	},
	description: "База знаний и заметок для изучения библиотек, технологий и инструментов разработки",

	authors: [{ name: "drujban", url: "https://drujban.vercel.app" }],
	creator: "drujban",
	publisher: "drujban",

	keywords: ["blog", "note", "drujban", "web", "JavaScript", "React", "Next.js"],
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1
		}
	},

	openGraph: {
		type: "website",
		locale: "ru_RU",
		url: "https://drujban.vercel.app",
		siteName: "drujban's blog",
		title: "drujban's blog",
		description: "Заметки от drujban по технологиям",
		images: [
			{
				url: "",
				width: 0,
				height: 0,
				alt: "drujban's blog"
			}
		]
	},

	twitter: {
		card: "summary_large_image",
		site: "@drujban",
		creator: "@drujban",
		title: "drujban's blog",
		description: "База знаний и заметок по технологиям",
		images: ["https://drujban.vercel.app/og.png"]
	},

	appleWebApp: {
		capable: true,
		title: "drujban's blog",
		statusBarStyle: "black-translucent"
	},

	formatDetection: {
		telephone: false,
		address: false,
		email: false
	},

	icons: {
		icon: [
			{ url: "./favicon.ico" },
			{ url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
			{ url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
		],
		shortcut: ["./favicon.ico"],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
	},

	manifest: "/site.webmanifest"
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} ${jetBrains.variable} scroll-smooth antialiased`}>
				<Providers>
					<Header />
					<main className="mt-12 flex flex-1 flex-col">{children}</main>
				</Providers>
				<Analytics />
			</body>
		</html>
	)
}
