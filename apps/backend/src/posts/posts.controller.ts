import { Controller, Get, Post, Body, UseGuards, Headers } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { JwtAuthGuard } from "../guards/auth.guard"
import type { Post as PostType } from "@repo/types"

@Controller("posts")
export class PostsController {
	constructor(private prisma: PrismaService) {}

	@Get()
	async getPosts(): Promise<PostType[]> {
		return await this.prisma.post.findMany({ orderBy: { createdAt: "desc" } })
	}

	@UseGuards(JwtAuthGuard)
	@Post()
	async createPost(@Body() body: { title: string; content: string }) {
		return await this.prisma.post.create({ data: body })
	}
}
