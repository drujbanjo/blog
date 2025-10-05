import { NextResponse } from "next/server"

export async function POST(req: Request) {
	try {
		const { password } = await req.json()

		const r = await fetch(process.env.API || "http://localhost:4000/graphql", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
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

		if (!r.ok) {
			return NextResponse.json({ ok: false }, { status: 502 })
		}

		const { data, errors } = await r.json()

		if (errors || !data?.login) {
			return NextResponse.json({ ok: false }, { status: 401 })
		}

		const token = data.login.token
		const res = NextResponse.json({ ok: true })

		// Установить cookie
		res.cookies.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax", // ← Важно! Используйте "lax" для same-site
			path: "/",
			maxAge: 60 * 60 * 12 // 12 часов
		})

		return res
	} catch (error) {
		console.error("Login API error:", error)
		return NextResponse.json({ ok: false }, { status: 500 })
	}
}
