import { Module } from "@nestjs/common"
import { PostsService } from "./posts.service"
import { PostsResolver } from "./posts.resolver"
import { PrismaService } from "../prisma/prisma.service"
import { JwtModule } from "@nestjs/jwt"
import { GqlJwtAuthGuard } from "../guards/auth.gql.guard"

@Module({
	imports: [
		JwtModule.register({
			// можно использовать register или registerAsync, если хочешь брать секрет из env
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "1h" }
		})
	],
	providers: [PostsResolver, PostsService, PrismaService, GqlJwtAuthGuard]
})
export class PostsModule {}
