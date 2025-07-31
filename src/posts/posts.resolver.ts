import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtGuard } from '../auth/guards/gql-jwt-guard/gql-jwt-guard.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreatePostInput, Post } from '../models/post.model';
import { JwtUser } from '../auth/jwt-user';
import { PostWithRelations } from '../types/prisma.types';

@Resolver()
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @UseGuards(GqlJwtGuard)
  @Mutation(() => Post)
  async createPost(
    @CurrentUser() user: JwtUser,
    @Args('postInput') input: CreatePostInput,
  ) {
    return this.postsService.createPost(user?.id, input);
  }

  @UseGuards(GqlJwtGuard)
  @Query(() => [Post], { name: 'Posts' })
  async getPosts(): Promise<PostWithRelations[]> {
    return this.postsService.getPosts();
  }
}
