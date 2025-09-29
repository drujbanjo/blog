"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { CheckTokenDocument } from "@/graphql"
import { TokenProvider } from "@/providers"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [token, setToken] = useState<string | null>(null)
	const [error, setError] = useState(false)

	useEffect(() => {
		const controller = new AbortController()
		const t = localStorage.getItem("token")
		if (!t) {
			router.replace("/login")
			return
		}

		const checkToken = async () => {
			try {
				const r = await fetch(process.env.NEXT_PUBLIC_API!, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						query: CheckTokenDocument.loc?.source.body,
						variables: { token: t }
					}),
					signal: controller.signal
				})
				const { data, errors } = await r.json()
				if (errors || !data?.checkToken) {
					localStorage.removeItem("token")
					router.replace("/login")
				} else {
					setToken(t)
				}
			} catch {
				// сеть или другая ошибка, не выходим сразу
				setError(true)
			} finally {
				setLoading(false)
			}
		}

		checkToken()
		return () => controller.abort()
	}, [router])

	if (loading) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-transparent" />
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex h-screen w-full flex-col items-center justify-center gap-2">
				<p>Ошибка сети. Попробуйте снова.</p>
				<button className="rounded bg-gray-200 px-4 py-2" onClick={() => location.reload()}>
					Перезагрузить
				</button>
			</div>
		)
	}

	return <TokenProvider value={token}>{children}</TokenProvider>
}
