import { ObjectType, Field, registerEnumType, ID, Int, InputType } from '@nestjs/graphql';
import {PostType, DifficultyLevel} from "./enums/post.enum"
import {User} from './user.model';

registerEnumType(PostType, {
  name: 'PostType',
})

registerEnumType(DifficultyLevel, {
  name: 'DifficultyLevel',
})

@ObjectType()
export class Post{
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  title: string;

  @Field()
  content: string;

  @Field(() => ID)
  author_id: string;

  @Field(() => PostType)
  type: PostType;

  @Field({nullable: true})
  code_snippet: string;

  @Field()
  language: string;

  @Field()
  github_repo: string;

  @Field()
  demo_url: string;

  @Field(() => [String])
  tags: string[];

  @Field(() => DifficultyLevel, { nullable: true })
  difficulty?: DifficultyLevel;

  @Field()
  is_question: boolean;

  @Field()
  is_showcase: boolean;

  @Field()
  is_tutorial: boolean;

  @Field()
  is_solved: boolean;

  // Engagement counters
  @Field(() => Int)
  likes_count: number;

  @Field(() => Int)
  comments_count: number;

  @Field(() => Int)
  views_count: number;

  @Field(() => Int)
  bookmarks_count: number;

  // Timestamps
  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  // Relations
  @Field(() => User)
  author: User;

  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => [Like])
  likes: Like[];

  @Field(() => [Bookmark])
  bookmarks: Bookmark[];
}

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => ID)
  author_id: string;

  @Field(() => ID)
  post_id: string;

  @Field(() => ID, { nullable: true })
  parent_id?: string;

  // Code-specific
  @Field({ nullable: true })
  code_snippet?: string;

  @Field({ nullable: true })
  language?: string;

  // Engagement
  @Field(() => Int)
  likes_count: number;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  // Relations
  @Field(() => User)
  author: User;

  @Field(() => Post)
  post: Post;

  @Field(() => Comment, { nullable: true })
  parent?: Comment;

  @Field(() => [Comment])
  replies: Comment[];

  @Field(() => [Like])
  likes: Like[];
}

@ObjectType()
export class Like {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  user_id: string;

  @Field(() => ID, { nullable: true })
  post_id?: string;

  @Field(() => ID, { nullable: true })
  comment_id?: string;

  @Field()
  created_at: Date;

  // Relations
  @Field(() => User)
  user: User;

  @Field(() => Post, { nullable: true })
  post?: Post;

  @Field(() => Comment, { nullable: true })
  comment?: Comment;
}

@ObjectType()
export class Bookmark {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  user_id: string;

  @Field(() => ID)
  post_id: string;

  @Field()
  created_at: Date;

  // Relations
  @Field(() => User)
  user: User;

  @Field(() => Post)
  post: Post;
}

@InputType()
export class CreatePostInput {
  @Field({nullable: true})
  title: string;

  @Field()
  content: string;

  @Field(() => PostType)
  type: PostType;

  @Field({nullable: true})
  code_snippet: string;

  @Field({nullable: true})
  language: string;

  @Field({ nullable: true })
  github_repo?: string;

  @Field({ nullable: true })
  demo_url?: string;

  @Field(() => [String])
  tags: string[];

  @Field(() => DifficultyLevel, { nullable: true })
  difficulty?: DifficultyLevel;

  @Field()
  is_question: boolean;

  @Field()
  is_showcase: boolean;

  @Field()
  is_tutorial: boolean;
}

@InputType()
export class CreateCommentInput {
  @Field()
  content: string;

  @Field(() => ID)
  post_id: string;

  @Field(() => ID, { nullable: true })
  parent_id?: string;

  @Field({ nullable: true })
  code_snippet?: string;

  @Field({ nullable: true })
  language?: string;
}
