import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload{
  @Field()
  userId: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  accessToken: string;
 }