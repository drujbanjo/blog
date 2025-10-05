import { NextResponse } from "next/server"

export async function POST(req: Request) {
	try {
		const { password } = await req.json()

		// Используем правильную переменную окружения
		const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT || "http://localhost:4200/graphql"

		const response = await fetch(graphqlEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				query: `
					mutation Login($password: String!) {
						login(password: $password) {
							token
						}
					}
				`,
				variables: { password }
			})
		})

		if (!response.ok) {
			console.error(`Backend responded with status: ${response.status}`)
			return NextResponse.json({ ok: false, error: "Backend service error" }, { status: 502 })
		}

		const { data, errors } = await response.json()

		if (errors) {
			console.error("GraphQL errors:", errors)
			return NextResponse.json({ ok: false, error: errors[0]?.message || "Authentication failed" }, { status: 401 })
		}

		if (!data?.login?.token) {
			return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 })
		}

		const token = data.login.token

		// Создаем response с успешным статусом
		const res = NextResponse.json({ ok: true })

		// Устанавливаем cookie с токеном
		res.cookies.set("token", token, {
			httpOnly: true, // Защита от XSS
			secure: process.env.NODE_ENV === "production", // HTTPS только в production
			sameSite: "lax", // Защита от CSRF
			path: "/",
			maxAge: 60 * 60 * 24 * 7 // 7 дней
		})

		return res
	} catch (error) {
		console.error("Login API error:", error)
		return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 })
	}
}
