import { Module } from "@nestjs/common"
import { PostsService } from "./posts.service"
import { PostsResolver } from "./posts.resolver"
import { PrismaService } from "../prisma/prisma.service"
import { GqlAuthGuard } from "../guards/auth.gql.guard"
import { JwtModule } from "@nestjs/jwt"

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "12h" }
		})
	],
	providers: [PostsResolver, PostsService, PrismaService, GqlAuthGuard]
})
export class PostsModule {}
