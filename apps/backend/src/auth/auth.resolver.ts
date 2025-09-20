import { Resolver, Mutation, Args, Query } from "@nestjs/graphql"
import { AuthService } from "./auth.service"
import { Login } from "./auth.model"

@Resolver()
export class AuthResolver {
	constructor(private authService: AuthService) {}

	@Mutation(() => Login)
	login(@Args("password") password: string) {
		const token = this.authService.login(password)
		return { token }
	}

	@Query(() => Boolean)
	checkToken(@Args("token") token: string) {
		return this.authService.checkToken(token)
	}
}
