import { Module } from "@nestjs/common"
import { PrismaModule } from "./prisma/prisma.module"
import { JwtModule } from "@nestjs/jwt"
import { AuthService } from "./auth/auth.service"
import { JwtAuthGuard } from "./guards/auth.guard"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { join } from "path"
import { PostsModule } from "./posts/posts.module"

@Module({
	imports: [
		PrismaModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "1h" }
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), "src/schema.graphql"), // схема будет генериться автоматически
			sortSchema: true
		}),
		PostsModule
	],
	providers: [AuthService, JwtAuthGuard],
	exports: [JwtAuthGuard]
})
export class AppModule {}
