import { Module } from "@nestjs/common"
import { PrismaModule } from "./prisma/prisma.module"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { join } from "path"
import { PostsModule } from "./posts/posts.module"
import { JwtModule } from "@nestjs/jwt"
import { Request } from "express"
import { AuthModule } from "./auth/auth.module"

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "1h" }
		}),
		AuthModule,
		PrismaModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), "src/schema.graphql"), // схема будет генериться автоматически
			sortSchema: true,
			context: ({ req }: { req: Request }) => ({ req })
		}),
		PostsModule
	]
})
export class AppModule {}
