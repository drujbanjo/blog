"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button, Container } from "@/components"

export default function AdminPage() {
	const router = useRouter()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const token = localStorage.getItem("token")
		if (!token) {
			router.replace("/login")
			return
		}

		fetch(process.env.NEXT_PUBLIC_API!, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				query: `
          query CheckToken($token: String!) {
            checkToken(token: $token)
          }
        `,
				variables: { token }
			})
		})
			.then(r => r.json())
			.then(res => {
				if (res.errors || !res.data?.checkToken) router.replace("/login")
			})
			.finally(() => setLoading(false))
	}, [router])

	if (loading) return null

	return (
		<Container size="lg">
			<h1 className="text-center text-7xl font-black">Hello admin</h1>
			<div className="flex items-center gap-4">
				<Button size="lg" asChild>
					<Link href="/admin/createPost">Create Post</Link>
				</Button>
			</div>
		</Container>
	)
}
