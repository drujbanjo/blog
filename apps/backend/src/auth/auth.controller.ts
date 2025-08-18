// auth/auth.controller.ts
import { Controller, Post, Body } from "@nestjs/common"
import { AuthService } from "./auth.service"

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("login")
	login(@Body() body: { password: string }) {
		if (this.authService.validateAdmin(body.password)) {
			return { token: this.authService.login() }
		}
		return { error: "Invalid password" }
	}
}
