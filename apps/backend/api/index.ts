import { NestFactory } from "@nestjs/core"
import { AppModule } from "../src/app.module"
import { Request, Response } from "express"

let cachedHandler: (req: Request, res: Response) => void

export default async function handler(req: Request, res: Response) {
	if (!cachedHandler) {
		const app = await NestFactory.create(AppModule)
		app.enableCors({
			origin: "http://localhost:3000",
			credentials: true
		})
		await app.init()

		const instance = app.getHttpAdapter().getInstance()
		cachedHandler = instance as unknown as (req: Request, res: Response) => void
	}

	return cachedHandler(req, res)
}
