import { NextResponse } from "next/server"

export async function POST(req: Request) {
	const { password } = await req.json()

	const r = await fetch(process.env.NEXT_PUBLIC_API!, {
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

	const { data, errors } = await r.json()
	if (errors || !data?.login) return NextResponse.json({ ok: false }, { status: 401 })

	const res = NextResponse.json({ ok: true })
	res.cookies.set("token", data.login.token, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		maxAge: 3600
	})
	return res
}
