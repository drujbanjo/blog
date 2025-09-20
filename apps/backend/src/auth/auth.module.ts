import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthResolver } from "./auth.resolver"
import { JwtModule } from "@nestjs/jwt"

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "12h" }
		})
	],
	providers: [AuthService, AuthResolver],
	exports: [AuthService] // 👈 ОБЯЗАТЕЛЬНО
})
export class AuthModule {}
