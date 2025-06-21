import { ObjectType, Field, registerEnumType, ID, Int} from '@nestjs/graphql';
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
  postType: PostType;

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

}