import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors() // enable CORS for dev
	await app.listen(process.env.PORT || 4200)
}
void bootstrap()
