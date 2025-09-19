import { ObjectType, Field } from "@nestjs/graphql"

@ObjectType()
export class Login {
	@Field()
	token: string
}
