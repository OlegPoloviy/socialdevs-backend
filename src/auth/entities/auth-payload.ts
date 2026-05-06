import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload {
  @Field()
  userId: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  avatar_url?: string;

  @Field()
  accessToken: string;

  @Field({ nullable: true })
  expiresAt?: string;
}
