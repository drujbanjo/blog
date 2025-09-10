import { Resolver, Query, Mutation, Args } from "@nestjs/graphql"
import { Post } from "./posts.model"
import { PostsService } from "./posts.service"
import { CreatePostInput } from "./create-post.input"
import { UpdatePostInput } from "./update-post.input"
import { UseGuards } from "@nestjs/common"
import { GqlJwtAuthGuard } from "../guards/auth.gql.guard"

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

	@UseGuards(GqlJwtAuthGuard)
	@Mutation(() => Post)
	createPost(@Args("data") data: CreatePostInput) {
		return this.service.create(data)
	}

	@UseGuards(GqlJwtAuthGuard)
	@Mutation(() => Post)
	updatePost(@Args("id") id: string, @Args("data") data: UpdatePostInput) {
		return this.service.update(id, data)
	}

	@UseGuards(GqlJwtAuthGuard)
	@Mutation(() => Boolean)
	deletePost(@Args("id") id: string) {
		return this.service.delete(id)
	}
}
