"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { useCheckTokenLazyQuery } from "@/graphql"
import { TokenProvider } from "@/providers"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const [valid, setValid] = useState(false)
	const [check, { data, error, loading }] = useCheckTokenLazyQuery()

	useEffect(() => {
		check({
			fetchPolicy: "no-cache"
		})
	}, [check])

	useEffect(() => {
		// Ждем пока loading закончится
		if (loading) return

		// Если ошибка сети - показываем экран ошибки (не редиректим)
		if (error) {
			return
		}

		// КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: проверяем data && data.checkToken
		// Если data undefined - просто ждем
		if (!data) {
			return
		}

		// Если data есть, но checkToken === false - редиректим
		if (!data.checkToken) {
			router.replace("/login")
			return
		}

		// Токен валиден
		setValid(true)
	}, [data, error, loading, router])

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
				<button className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300" onClick={() => location.reload()}>
					Перезагрузить
				</button>
			</div>
		)
	}

	return valid ? <TokenProvider value="ok">{children}</TokenProvider> : null
}
