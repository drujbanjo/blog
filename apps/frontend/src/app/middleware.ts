import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// 1. Защита GraphQL API endpoint
	if (pathname === "/api/graphql") {
		const method = request.method

		// Разрешаем только POST и OPTIONS
		if (!["POST", "OPTIONS"].includes(method)) {
			return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
		}

		// Проверка Content-Type для POST запросов
		if (method === "POST") {
			const contentType = request.headers.get("content-type")
			if (!contentType?.includes("application/json")) {
				return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 })
			}
		}

		return NextResponse.next()
	}

	// 2. Защита админ-панели
	if (pathname.startsWith("/admin")) {
		const token = request.cookies.get("token")?.value

		// Если токена нет - редирект на логин
		if (!token) {
			const loginUrl = new URL("/login", request.url)
			// Сохраняем URL куда хотел попасть пользователь
			loginUrl.searchParams.set("redirect", pathname)
			return NextResponse.redirect(loginUrl)
		}

		// Опционально: можно проверить токен на валидность
		// Раскомментируйте если хотите проверять токен через API
		/*
		try {
			const checkResponse = await fetch(`${request.nextUrl.origin}/api/graphql`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Cookie': `token=${token}`
				},
				body: JSON.stringify({
					query: 'query CheckToken { checkToken }'
				})
			})

			const data = await checkResponse.json()
			
			if (!data?.data?.checkToken) {
				// Токен невалидный - удаляем cookie и редиректим
				const response = NextResponse.redirect(new URL('/login', request.url))
				response.cookies.delete('token')
				return response
			}
		} catch (error) {
			console.error('Token validation error:', error)
			// В случае ошибки редиректим на логин
			return NextResponse.redirect(new URL('/login', request.url))
		}
		*/
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/api/graphql", "/admin/:path*"]
}
