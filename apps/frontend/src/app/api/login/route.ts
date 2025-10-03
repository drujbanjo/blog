import axios, { AxiosResponse } from "axios"
import { NextResponse } from "next/server"

interface LoginResponseData {
	login: { token: string } | null
}

interface GraphQLResponse<T> {
	data: T
	errors?: { message: string }[]
}

export async function POST(req: Request) {
	try {
		const { password } = await req.json()

		const r: AxiosResponse<GraphQLResponse<LoginResponseData>> = await axios.post(
			process.env.BACKEND_API || "http://localhost:4000/graphql",
			{
				query: `
					mutation Login($password: String!) {
						login(password: $password) {
							token
						}
					}
				`,
				variables: { password }
			},
			{
				headers: { "Content-Type": "application/json" },
				withCredentials: true
			}
		)

		const { data, errors } = r.data

		if (errors || !data.login) {
			return NextResponse.json({ ok: false }, { status: 401 })
		}

		const token = data.login.token
		const res = NextResponse.json({ ok: true })

		res.cookies.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 12 // 12 часов
		})

		return res
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error("Login API error:", error?.response?.data || error.message)
		return NextResponse.json({ ok: false }, { status: 500 })
	}
}
