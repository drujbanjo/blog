import { NestFactory } from "@nestjs/core"
import { AppModule } from "../src/app.module"
import { ExpressAdapter } from "@nestjs/platform-express"
import express, { Request, Response } from "express"

let cachedApp: express.Express

export default async function handler(req: Request, res: Response) {
	if (!cachedApp) {
		const server = express()
		const app = await NestFactory.create(AppModule, new ExpressAdapter(server))
		app.enableCors()
		await app.init()
		cachedApp = server
	}

	return cachedApp(req, res)
}
