import { Resolver, Mutation, Args, Query, Context } from "@nestjs/graphql"
import { AuthService } from "./auth.service"
import { Login } from "./auth.model"
import { Response } from "express"
@Resolver()
export class AuthResolver {
	constructor(private authService: AuthService) {}

	@Mutation(() => Login)
	login(@Args("password") password: string, @Context() ctx: { res: Response }) {
		const token = this.authService.login(password)
		ctx.res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none"
		})
		return { token } // теперь GraphQL вернёт токен
	}

	@Query(() => Boolean)
	checkToken(@Args("token") token: string) {
		return this.authService.checkToken(token)
	}
}
