import { APIGatewayProxyEvent, Context, APIGatewayProxyResult, Callback } from "aws-lambda"
import serverlessExpress from "@vendia/serverless-express"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "../src/app.module"
import { ExpressAdapter } from "@nestjs/platform-express"
import express from "express"

type LambdaHandler = (
	event: APIGatewayProxyEvent,
	context: Context,
	callback: Callback<APIGatewayProxyResult>
) => Promise<APIGatewayProxyResult>

let cachedHandler: LambdaHandler

export const handler: LambdaHandler = async (event, context, callback) => {
	if (!cachedHandler) {
		const expressApp = express()
		const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp))
		nestApp.enableCors()
		await nestApp.init()

		cachedHandler = serverlessExpress({ app: expressApp }) as unknown as LambdaHandler
	}

	return cachedHandler(event, context, callback)
}
