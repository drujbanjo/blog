import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreatePostInput } from "./create-post.input"
import { UpdatePostInput } from "./update-post.input"

@Injectable()
export class PostsService {
	constructor(private prisma: PrismaService) {}

	findAll() {
		return this.prisma.post.findMany()
	}

	findOne(id: string) {
		return this.prisma.post.findUnique({ where: { id } })
	}

	async create(data: CreatePostInput) {
		return this.prisma.post.create({ data })
	}

	async update(id: string, data: UpdatePostInput) {
		const post = await this.prisma.post.findUnique({ where: { id } })
		if (!post) {
			throw new Error(`Post with id ${id} not found`)
		}
		return this.prisma.post.update({
			where: { id },
			data
		})
	}

	async delete(id: string) {
		const post = await this.prisma.post.findUnique({ where: { id } })
		if (!post) throw new NotFoundException(`Post ${id} not found`)
		await this.prisma.post.delete({ where: { id } })
		return true
	}
}
