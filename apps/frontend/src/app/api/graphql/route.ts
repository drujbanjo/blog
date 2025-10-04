import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		// Получаем токен из cookies
		const token = req.cookies.get("token")?.value

		const response = await axios.post(process.env.API || "http://localhost:4200/graphql", body, {
			headers: {
				"Content-Type": "application/json",
				...(token && { Cookie: `token=${token}` })
			},
			withCredentials: true
		})

		return NextResponse.json(response.data)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error("GraphQL proxy error:", error?.response?.data || error.message)
		return NextResponse.json({ errors: [{ message: "Internal server error" }] }, { status: 500 })
	}
}
