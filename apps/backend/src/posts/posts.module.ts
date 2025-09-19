import { Module } from "@nestjs/common"
import { PostsService } from "./posts.service"
import { PostsResolver } from "./posts.resolver"
import { PrismaService } from "../prisma/prisma.service"
import { GqlJwtAuthGuard } from "../guards/auth.gql.guard"
import { AuthModule } from "src/auth/auth.module"

@Module({
	imports: [AuthModule],
	providers: [PostsResolver, PostsService, PrismaService, GqlJwtAuthGuard]
})
export class PostsModule {}
