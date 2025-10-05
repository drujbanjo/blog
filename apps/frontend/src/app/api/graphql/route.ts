import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		// Получаем токен из cookies
		const token = req.cookies.get("token")?.value

		const response = await fetch(process.env.API || "http://localhost:4200/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...(token && { Cookie: `token=${token}` }) // Передаем cookie на backend
			},
			credentials: "include",
			body: JSON.stringify(body)
		})

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error("GraphQL proxy error:", error)
		return NextResponse.json({ errors: [{ message: "Internal server error" }] }, { status: 500 })
	}
}
