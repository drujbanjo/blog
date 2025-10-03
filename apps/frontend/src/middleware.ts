import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
	const token = req.cookies.get("token")?.value

	// если токена нет и пользователь идёт в /admin
	if (!token && req.nextUrl.pathname.startsWith("/admin")) {
		const loginUrl = new URL("/login", req.url)
		return NextResponse.redirect(loginUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/admin/:path*"] // проверяем только админку
}
