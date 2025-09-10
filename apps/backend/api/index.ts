import { NestFactory } from "@nestjs/core"
import { AppModule } from "../src/app.module"
import { Request, Response } from "express"

let cachedHandler: (req: Request, res: Response) => void

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	await app.init()
	const instance = app.getHttpAdapter().getInstance()
	return instance as (req: Request, res: Response) => void
}

export default async function handler(req: Request, res: Response) {
	if (!cachedHandler) {
		cachedHandler = await bootstrap()
	}
	return cachedHandler(req, res)
}
