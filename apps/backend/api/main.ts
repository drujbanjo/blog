import { NestFactory } from "@nestjs/core"
import { AppModule } from "../src/app.module"
import { ExpressAdapter } from "@nestjs/platform-express"
import serverless from "serverless-http"
import express from "express"
import { PrismaClient } from "@prisma/client"

const server = express()

declare global {
	var prisma: PrismaClient
}

if (!global.prisma) {
	global.prisma = new PrismaClient()
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule, new ExpressAdapter(server))
	app.enableCors()
	await app.init()
}

bootstrap()

export const handler = serverless(server)
