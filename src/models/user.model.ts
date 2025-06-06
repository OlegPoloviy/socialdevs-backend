import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field()
    email: string;

    @Field()
    username: string;

    @Field({ nullable: true })
    bio?: string;

    @Field({ nullable: true })
    avatar_url?: string;

    @Field({ nullable: true })
    website?: string;

    @Field({ nullable: true })
    github_url?: string;

    @Field({ nullable: true })
    twitter_url?: string;

    @Field({ nullable: true })
    linkedin_url?: string;

    @Field({ nullable: true })
    location?: string;

    @Field(() => [String])
    skills: string[];

    @Field()
    created_at: Date;

    @Field()
    updated_at: Date;
}