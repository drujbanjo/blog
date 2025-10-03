import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { GqlExecutionContext } from "@nestjs/graphql"

@Injectable()
export class GqlJwtAuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const ctx = GqlExecutionContext.create(context)
		const { token }: { token: string } = ctx.getContext() // Получаем токен из контекста

		if (!token) {
			throw new UnauthorizedException("Token not provided")
		}

		try {
			const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET })
			// Сохраняем пользователя в контексте для дальнейшего использования
			ctx.getContext().user = payload
			return true
		} catch {
			throw new UnauthorizedException("Invalid token")
		}
	}
}
