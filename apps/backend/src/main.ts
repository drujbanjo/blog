import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import cookieParser from "cookie-parser"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors({
		origin: true,
		credentials: true
	}) // enable CORS for dev
	app.use(cookieParser())
	await app.listen(process.env.PORT || 4200)
	console.log(`Application is running on: ${await app.getUrl()}`)
}
void bootstrap()
