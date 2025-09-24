import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Button, Container } from "@/components"

export default async function AdminPage() {
	const cookieStore = await cookies()
	const token = cookieStore.get("token")?.value

	const res = await fetch(process.env.NEXT_PUBLIC_API!, {
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
	const check = await res.json()

	if (check.errors || !check.data?.checkToken) redirect("/login")

	return (
		<Container size="lg">
			<h1 className="text-center text-7xl font-black">Hello admin</h1>
			<div className="flex items-center gap-4">
				<Button size={"lg"} asChild>
					<Link href="/admin/createPost">Create Post</Link>
				</Button>
			</div>
		</Container>
	)
}
