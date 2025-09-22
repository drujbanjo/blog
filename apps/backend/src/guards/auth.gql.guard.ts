import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { GqlExecutionContext } from "@nestjs/graphql"
import { Request } from "express"

@Injectable()
export class GqlJwtAuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const ctx = GqlExecutionContext.create(context)
		const req = ctx.getContext<{ req: Request }>().req

		const token = req.headers.token as string | undefined
		if (!token) throw new UnauthorizedException("Token not found")

		try {
			this.jwtService.verify(token, { secret: process.env.JWT_SECRET })
			return true
		} catch {
			throw new UnauthorizedException("Invalid token")
		}
	}
}
