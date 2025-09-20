import { NestFactory } from "@nestjs/core"
import { AppModule } from "../src/app.module"
import serverlessExpress from "@vendia/serverless-express"

let cachedServer: any

export default async function handler(event: any, context: any) {
	if (!cachedServer) {
		const app = await NestFactory.create(AppModule)
		app.enableCors()
		await app.init()

		const expressApp = app.getHttpAdapter().getInstance()
		cachedServer = serverlessExpress({ app: expressApp })
	}
	return cachedServer(event, context)
}
