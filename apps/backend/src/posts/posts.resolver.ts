import { Resolver, Query, Mutation, Args } from "@nestjs/graphql"
import { Post } from "./posts.model"
import { PostsService } from "./posts.service"
import { CreatePostInput } from "./create-post.input"
import { UpdatePostInput } from "./update-post.input"
import { UseGuards } from "@nestjs/common"
import { GqlAuthGuard } from "../guards/auth.gql.guard"

@Resolver(() => Post)
export class PostsResolver {
	constructor(private service: PostsService) {}

	@Query(() => [Post])
	posts() {
		return this.service.findAll()
	}

	@Query(() => Post, { nullable: true })
	post(@Args("id") id: string) {
		return this.service.findOne(id)
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => Post)
	createPost(@Args("data") data: CreatePostInput) {
		return this.service.create(data)
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => Post)
	async updatePost(@Args("id") id: string, @Args("data") data: UpdatePostInput) {
		const updatedPost = await this.service.update(id, data)
		return updatedPost
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => Boolean)
	deletePost(@Args("id") id: string) {
		return this.service.delete(id)
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => Boolean)
	deletePosts(@Args({ name: "ids", type: () => [String] }) ids: string[]) {
		return this.service.deleteMany(ids)
	}
}
