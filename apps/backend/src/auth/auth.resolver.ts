import { Resolver, Mutation, Args, Query, Context } from "@nestjs/graphql"
import { AuthService } from "./auth.service"
import { Login } from "./auth.model"
import { Request, Response } from "express"
import { JwtService } from "@nestjs/jwt"

@Resolver()
export class AuthResolver {
	constructor(
		private authService: AuthService,
		private jwtService: JwtService
	) {}

	@Mutation(() => Login)
	login(@Args("password") password: string, @Context() ctx: { res: Response }) {
		const token = this.authService.login(password)
		ctx.res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
			maxAge: 60 * 60 * 12 * 1000 // 12 часов в миллисекундах
		})
		return { token }
	}

	@Query(() => Boolean, { name: "checkToken" })
	checkToken(@Context() context: any): boolean {
		try {
			const request = context.req

			// Проверяем Authorization header (от /api/graphql)
			const authHeader = request.headers.authorization

			if (authHeader && authHeader.startsWith("Bearer ")) {
				const token = authHeader.substring(7)

				try {
					const payload = this.jwtService.verify(token)
					console.log("✅ Token valid, payload:", payload)
					return true
				} catch (error) {
					console.log("❌ Token invalid:", error.message)
					return false
				}
			}

			// Fallback на Cookie (от /api/login)
			const cookieToken = request.cookies?.token

			if (cookieToken) {
				try {
					const payload = this.jwtService.verify(cookieToken)
					console.log("✅ Token valid, payload:", payload)
					return true
				} catch (error) {
					console.log("❌ Token invalid:", error.message)
					return false
				}
			}

			return false
		} catch (error) {
			console.error("💥 CheckToken error:", error)
			return false
		}
	}
}
