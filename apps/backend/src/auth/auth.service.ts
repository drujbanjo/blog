import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

	login(password: string) {
		// Проверяем пароль администратора
		if (password !== process.env.ADMIN_PASSWORD) {
			throw new UnauthorizedException("Invalid password")
		}

		// Генерируем токен для админа
		const payload = { role: "admin" }
		return this.jwtService.sign(payload)
	}
}
