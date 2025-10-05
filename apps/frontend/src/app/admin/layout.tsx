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
			fetchPolicy: "network-only"
		})
	}, [check])

	useEffect(() => {
		if (loading) {
			return
		}

		if (error) {
			return
		}

		if (!data) {
			return
		}

		if (!data.checkToken) {
			router.replace("/login?redirect=/admin")
			return
		}

		setValid(true)
	}, [data, error, loading, router])

	if (loading) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
					<p className="text-gray-600">Checking authentication...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex h-screen w-full flex-col items-center justify-center gap-4">
				<div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
					<h2 className="mb-2 text-xl font-bold text-red-700">Connection Error</h2>
					<p className="mb-2 text-red-600">{error.message}</p>
					<pre className="mb-4 overflow-auto text-left text-xs text-red-500">{JSON.stringify(error, null, 2)}</pre>
					<button
						className="rounded bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700"
						onClick={() => location.reload()}
					>
						Retry
					</button>
				</div>
			</div>
		)
	}

	if (!valid) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<p className="text-gray-600">Validating...</p>
			</div>
		)
	}

	return (
		<TokenProvider value="ok">
			<div className="flex min-h-screen flex-col">
				<main className="flex-1 py-8">{children}</main>
			</div>
		</TokenProvider>
	)
}
