import { ObjectType, Field } from "@nestjs/graphql"

@ObjectType()
export class Post {
	@Field()
	id: string

	@Field()
	title: string

	@Field()
	content: string

	@Field(() => [String])
	tags: string[]

	@Field()
	createdAt: Date

	@Field()
	updatedAt: Date
}
