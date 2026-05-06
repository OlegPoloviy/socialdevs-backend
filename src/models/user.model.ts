import {
  ObjectType,
  Field,
  ID,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { IsString, IsEmail, Length, IsOptional, IsUUID } from 'class-validator';
import { AuthProvider } from './enums/user.enum';
import { Post, Like, Comment, Bookmark, Repost } from './post.model';

registerEnumType(AuthProvider, {
  name: 'AuthProvider',
});

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

  @Field(() => [String], { nullable: true })
  interests: string[];

  @Field(() => [String])
  skills: string[];

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => AuthProvider)
  provider: AuthProvider;

  //relations
  @Field(() => [Post])
  posts: Post[];

  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => [Like])
  likes: Like[];

  @Field(() => [Bookmark])
  bookmarks: Bookmark[];

  @Field(() => [Repost])
  reposts: Repost[];

  @Field(() => [Follow])
  following: Follow[];

  @Field(() => [Follow])
  followers: Follow[];

  @Field(() => Int)
  followers_count: number;

  @Field(() => Int)
  following_count: number;
}

@ObjectType()
export class Follow {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  follower_id: string;

  @Field(() => ID)
  following_id: string;

  @Field()
  created_at: Date;

  @Field(() => User)
  follower: User;

  @Field(() => User)
  following: User;
}

@ObjectType()
export class FollowResponse {
  @Field(() => Int)
  followers_count: number;

  @Field(() => Int)
  following_count: number;

  @Field()
  following: boolean;
}

@InputType()
export class UserInput {
  @IsString()
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @Field()
  username: string;

  @IsString()
  @Length(6, 32)
  @Field()
  password: string;
}

@InputType()
export class UpdateUserInput {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  username?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @Field({ nullable: true })
  email?: string;

  @IsOptional()
  @IsString()
  @Length(6, 32)
  @Field({ nullable: true })
  password?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  bio?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  avatar_url?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  website?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  github_url?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  twitter_url?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  linkedin_url?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  location?: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  skills?: string[];
}

@InputType()
export class SignInInput {
  @IsOptional()
  @IsEmail()
  @Field({ nullable: true })
  email?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  username?: string;

  @IsString()
  @Field()
  password: string;
}

@InputType()
export class InterestsInput {
  @IsUUID()
  @Field()
  userId: string;

  @Field(() => [String])
  interests: string[];
}
