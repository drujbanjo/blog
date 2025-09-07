import { NestFactory } from "@nestjs/core"
import { AppModule } from "../src/app.module"
import { ExpressAdapter } from "@nestjs/platform-express"
import serverless from "serverless-http"
import express from "express"
import { PrismaClient } from "@prisma/client"

const server = express()

// Prisma singleton
declare global {
	var prisma: PrismaClient
}
if (!global.prisma) {
	global.prisma = new PrismaClient({
		log: ["query", "info", "warn", "error"]
	})
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule, new ExpressAdapter(server))
	app.enableCors()
	await app.init()
}

bootstrap().catch(err => {
	console.error("Bootstrap failed:", err)
})

// CommonJS export для Vercel
module.exports = serverless(server)
