import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtGuard } from '../auth/guards/gql-jwt-guard/gql-jwt-guard.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  BookmarkResponse,
  Comment,
  CommentLikeResponse,
  CreateCommentInput,
  CreatePostInput,
  LikeResponse,
  Post,
  RepostResponse,
} from '../models/post.model';
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

  @UseGuards(GqlJwtGuard)
  @Mutation(() => LikeResponse)
  async toggleLikePost(
    @Args('postId') postId: string,
    @CurrentUser() user: JwtUser,
  ): Promise<LikeResponse> {
    return this.postsService.toggleLikePost(postId, user.id);
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => Comment)
  async createComment(
    @CurrentUser() user: JwtUser,
    @Args('commentInput') input: CreateCommentInput,
  ) {
    return this.postsService.createComment(user.id, input);
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => CommentLikeResponse)
  async toggleLikeComment(
    @Args('commentId') commentId: string,
    @CurrentUser() user: JwtUser,
  ): Promise<CommentLikeResponse> {
    return this.postsService.toggleLikeComment(commentId, user.id);
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => BookmarkResponse)
  async toggleBookmarkPost(
    @Args('postId') postId: string,
    @CurrentUser() user: JwtUser,
  ): Promise<BookmarkResponse> {
    return this.postsService.toggleBookmarkPost(postId, user.id);
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => RepostResponse)
  async toggleRepostPost(
    @Args('postId') postId: string,
    @CurrentUser() user: JwtUser,
  ): Promise<RepostResponse> {
    return this.postsService.toggleRepostPost(postId, user.id);
  }
}
