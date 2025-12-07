import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { PostsModule } from "./posts/posts.module"
import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./auth/auth.module"
import { AppController } from "./app.controller"
import { RedisModule } from "./redis/redis.module"

@Module({
	imports: [
		RedisModule,
		AuthModule,
		PrismaModule,
		PostsModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true, // генерируем схему на лету
			context: ({ req, res }) => {
				const tokenFromCookie = req.cookies?.token
				const authHeader = req.headers?.authorization
				const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined
				return { req, res, token: tokenFromCookie || tokenFromHeader } // 👈 добавь res
			},
			introspection: process.env.NODE_ENV !== "production"
		})
	],
	controllers: [AppController]
})
export class AppModule {}
