import { Resolver, Mutation, Args } from "@nestjs/graphql"
import { AuthService } from "./auth.service"

@Resolver()
export class AuthResolver {
	constructor(private authService: AuthService) {}

	@Mutation(() => String)
	login(@Args("password") password: string) {
		return this.authService.login(password)
	}
}
