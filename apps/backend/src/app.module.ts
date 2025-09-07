import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { PostsModule } from "./posts/posts.module"
import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./auth/auth.module"
import { JwtModule } from "@nestjs/jwt"
import { Request } from "express"

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "1h" }
		}),
		AuthModule,
		PrismaModule,
		PostsModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true, // генерируем схему на лету
			path: "/graphql", // endpoint GraphQL
			playground: true, // включить GraphQL Playground
			context: ({ req }: { req: Request }) => ({ req })
		})
	]
})
export class AppModule {}
