import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext().req

		// Проверяем Authorization header (приоритет)
		const authHeader = request.headers.authorization
		if (authHeader && authHeader.startsWith("Bearer ")) {
			const token: string = authHeader.substring(7)
			return this.validateToken(token)
		}

		// Fallback на Cookie
		const token: string = request.cookies?.token
		if (token) {
			return this.validateToken(token)
		}

		throw new UnauthorizedException("No authentication token found")
	}

	private validateToken(token: string): boolean {
		try {
			const payload = this.jwtService.verify(token)
			// Можете добавить payload в request если нужно
			return !!payload
		} catch (error: any) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			throw new UnauthorizedException("Invalid token", error)
		}
	}
}
