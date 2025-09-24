import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { Container } from "@/components"
import CreatePostForm from "@/components/createPostForm"

export default async function CreatePostPage() {
	const cookieStore = await cookies()
	const token = cookieStore.get("token")?.value

	const res = await fetch(process.env.NEXT_PUBLIC_API!, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
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
			<h1 className="text-center text-7xl font-black">Create Post</h1>
			<CreatePostForm />
		</Container>
	)
}
