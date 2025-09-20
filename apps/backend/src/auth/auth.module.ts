import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthResolver } from "./auth.resolver"
import { JwtSharedModule } from "src/jwt.module"

@Module({
	imports: [JwtSharedModule],
	providers: [AuthService, AuthResolver],
	exports: [AuthService] // 👈 ОБЯЗАТЕЛЬНО
})
export class AuthModule {}
