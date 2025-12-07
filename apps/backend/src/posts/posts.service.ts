import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { RedisService } from "../redis/redis.service"
import { CreatePostInput } from "./create-post.input"
import { UpdatePostInput } from "./update-post.input"

@Injectable()
export class PostsService {
	constructor(
		private prisma: PrismaService,
		private redis: RedisService
	) {}

	// Преобразует строковые даты обратно в Date объекты
	private deserializeDates(data: any): any {
		if (!data) return data

		if (Array.isArray(data)) {
			return data.map(item => this.deserializeDates(item))
		}

		if (typeof data === "object") {
			const result = { ...data }

			// Поля с датами в вашей модели Post
			const dateFields = ["createdAt", "updatedAt", "publishedAt"]

			for (const field of dateFields) {
				if (result[field] && typeof result[field] === "string") {
					result[field] = new Date(result[field])
				}
			}

			return result
		}

		return data
	}

	async findAll() {
		const cacheKey = "posts:all"

		// Проверяем кеш
		const cached = await this.redis.get<any[]>(cacheKey)
		if (cached) {
			// Преобразуем строковые даты обратно в Date
			return this.deserializeDates(cached)
		}

		// Получаем из БД
		const posts = await this.prisma.post.findMany({
			orderBy: { createdAt: "desc" }
		})

		// Кешируем на 5 минут
		await this.redis.set(cacheKey, posts, 300)

		return posts
	}

	async findOne(id: string) {
		const cacheKey = `post:${id}`

		// Проверяем кеш
		const cached = await this.redis.get<any>(cacheKey)
		if (cached) {
			// Преобразуем строковые даты обратно в Date
			return this.deserializeDates(cached)
		}

		// Получаем из БД
		const post = await this.prisma.post.findUnique({ where: { id } })

		if (post) {
			// Кешируем на 10 минут
			await this.redis.set(cacheKey, post, 600)
		}

		return post
	}

	async create(data: CreatePostInput) {
		const post = await this.prisma.post.create({ data })

		// Инвалидируем кеш всех постов
		await this.redis.del("posts:all")

		return post
	}

	async update(id: string, data: UpdatePostInput) {
		const updated = await this.prisma.post.update({
			where: { id },
			data: {
				...data,
				updatedAt: new Date()
			}
		})

		// Инвалидируем кеши
		await this.redis.del(`post:${id}`)
		await this.redis.del("posts:all")

		return updated
	}

	async delete(id: string) {
		const post = await this.prisma.post.findUnique({ where: { id } })
		if (!post) throw new NotFoundException(`Post ${id} not found`)

		await this.prisma.post.delete({ where: { id } })

		// Инвалидируем кеши
		await this.redis.del(`post:${id}`)
		await this.redis.del("posts:all")

		return true
	}

	async deleteMany(ids: string[]) {
		const posts = await this.prisma.post.findMany({
			where: { id: { in: ids } }
		})

		if (posts.length !== ids.length) {
			const foundIds = posts.map(post => post.id)
			const notFoundIds = ids.filter(id => !foundIds.includes(id))
			throw new NotFoundException(`Posts with ids ${notFoundIds.join(", ")} not found`)
		}

		await this.prisma.post.deleteMany({
			where: { id: { in: ids } }
		})

		// Инвалидируем все кеши постов
		for (const id of ids) {
			await this.redis.del(`post:${id}`)
		}
		await this.redis.del("posts:all")

		return true
	}
}
