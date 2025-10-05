import { NextRequest, NextResponse } from "next/server"

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || "http://localhost:4200/graphql"

// Кэш для OPTIONS запросов
const CORS_HEADERS = {
	"Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Access-Control-Allow-Credentials": "true"
}

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 204,
		headers: CORS_HEADERS
	})
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		// Валидация GraphQL запроса
		if (!body.query && !body.operationName) {
			return NextResponse.json({ errors: [{ message: "Invalid GraphQL request" }] }, { status: 400 })
		}

		// Получаем токен из cookies
		const token = req.cookies.get("token")?.value

		// Создаем заголовки для бэкенда
		const headers: HeadersInit = {
			"Content-Type": "application/json"
		}

		// Передаем токен через Authorization header
		if (token) {
			headers["Authorization"] = `Bearer ${token}`
		}

		// Форвардим запрос на NestJS backend
		const response = await fetch(GRAPHQL_ENDPOINT, {
			method: "POST",
			headers,
			body: JSON.stringify(body),
			signal: AbortSignal.timeout(30000)
		})

		if (!response.ok) {
			console.error(`❌ GraphQL backend error: ${response.status} ${response.statusText}`)
			const errorText = await response.text()
			console.error("Error details:", errorText)

			return NextResponse.json({ errors: [{ message: "Backend service error" }] }, { status: response.status })
		}

		const data = await response.json()

		// Возвращаем ответ от бэкенда
		return NextResponse.json(data, {
			status: 200,
			headers: {
				"Cache-Control": "no-store, must-revalidate",
				...CORS_HEADERS
			}
		})
	} catch (error) {
		if (error instanceof Error && error.name === "TimeoutError") {
			return NextResponse.json({ errors: [{ message: "Request timeout" }] }, { status: 504 })
		}

		return NextResponse.json({ errors: [{ message: "Internal server error" }] }, { status: 500 })
	}
}
