import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"

interface JwtPayload {
	role: string
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest<Request>()
		const authHeader = req.headers["authorization"]
		if (!authHeader) throw new UnauthorizedException()

		const token = authHeader.split(" ")[1]
		try {
			const payload = this.jwtService.verify<JwtPayload>(token, { secret: process.env.JWT_SECRET })
			return payload.role === "admin"
		} catch {
			throw new UnauthorizedException()
		}
	}
}
