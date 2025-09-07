import { Handler, Context, Callback } from "aws-lambda"
import serverlessExpress from "@vendia/serverless-express"
import express from "express"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ExpressAdapter } from "@nestjs/platform-express"

const server = express()

export const createNestServer = async () => {
	const app = await NestFactory.create(AppModule, new ExpressAdapter(server))
	app.enableCors()
	await app.init()
	return app
}

let cachedServer: Handler

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
	if (!cachedServer) {
		await createNestServer()
		// Приведение типа к Handler
		cachedServer = serverlessExpress({ app: server }) as Handler
	}
	return cachedServer(event, context, callback)
}
