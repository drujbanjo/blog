import { Resolver, Mutation, Args } from "@nestjs/graphql"
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
}
