import { Resolver, Mutation, Args, Query, Context } from "@nestjs/graphql"
import { AuthService } from "./auth.service"
import { Login } from "./auth.model"
import { Request, Response } from "express"

@Resolver()
export class AuthResolver {
	constructor(private authService: AuthService) {}

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

	@Query(() => Boolean)
	checkToken(@Context() ctx: { req: Request }) {
		// Читаем токен из cookies вместо аргументов
		const token: string = ctx.req.cookies?.token

		if (!token) {
			return false
		}

		return this.authService.checkToken(token)
	}
}
