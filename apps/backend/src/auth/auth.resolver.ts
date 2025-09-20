import { Resolver, Mutation, Args, Query } from "@nestjs/graphql"
import { AuthService } from "./auth.service"
import { Login } from "./auth.model"
import { JwtService } from "@nestjs/jwt"
import { UnauthorizedException } from "@nestjs/common"

@Resolver()
export class AuthResolver {
	constructor(
		private authService: AuthService,
		private jwtService: JwtService
	) {}

	@Mutation(() => Login)
	login(@Args("password") password: string) {
		const token = this.authService.login(password)
		return { token }
	}

	@Query(() => Boolean)
	checkToken(@Args("token") token: string) {
		try {
			this.jwtService.verify(token)
			return true
		} catch {
			throw new UnauthorizedException("Invalid token")
		}
	}
}
