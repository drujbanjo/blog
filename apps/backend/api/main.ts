import { NestFactory } from "@nestjs/core"
import { AppModule } from "../src/app.module"
import { Server } from "http"

let server: Server

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	await app.init()
	return app.getHttpAdapter().getInstance()
}

export default async function handler(req: any, res: any) {
	if (!server) {
		const app = await bootstrap()
		server = app
	}
	return server(req, res)
}
