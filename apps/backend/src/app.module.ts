import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { PrismaModule } from "./prisma/prisma.module"
import { PostsController } from "./posts/posts.controller"
import { JwtModule } from "@nestjs/jwt"
import { AuthService } from "./auth/auth.service"
import { JwtAuthGuard } from "./guards/auth.guard"

@Module({
	imports: [
		PrismaModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET || "defaultSecret",
			signOptions: { expiresIn: "1h" }
		})
	],
	controllers: [AppController, PostsController],
	providers: [AppService, AuthService, JwtAuthGuard],
	exports: [JwtAuthGuard]
})
export class AppModule {}
