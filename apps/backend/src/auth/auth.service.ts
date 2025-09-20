import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

	login(password: string) {
		if (password !== process.env.ADMIN_PASSWORD) {
			throw new UnauthorizedException("Invalid password")
		}

		const payload = { role: "admin" }
		return this.jwtService.sign(payload)
	}

	checkToken(token: string) {
		try {
			const result = this.jwtService.verify(token)
			return result
		} catch {
			throw new UnauthorizedException("Invalid token")
		}
	}
}
