import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { PostsModule } from "./posts/posts.module"
import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./auth/auth.module"
import { AppController } from "./app.controller"

@Module({
	imports: [
		AuthModule,
		PrismaModule,
		PostsModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true, // генерируем схему на лету
			playground: true // включить GraphQL Playground
		})
	],
	controllers: [AppController]
})
export class AppModule {}
