// guards/auth.gql.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { GqlExecutionContext } from "@nestjs/graphql"
import { IncomingHttpHeaders } from "http"

@Injectable()
export class GqlJwtAuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const ctx = GqlExecutionContext.create(context)
		const req = ctx.getContext<{ req: { headers: IncomingHttpHeaders } }>().req

		if (!req) {
			throw new UnauthorizedException("Request not found in GraphQL context")
		}

		// безопасно получить заголовок
		const authHeader = (req.headers.authorization as string) || ""
		const token = authHeader.replace(/^Bearer\s+/i, "")

		if (!token) {
			throw new UnauthorizedException("Token not found")
		}

		try {
			console.log(process.env.JWT_SECRET)
			console.log(token)
			this.jwtService.verify(token, { secret: process.env.JWT_SECRET })
			return true
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			throw new UnauthorizedException("Invalid token")
		}
	}
}
