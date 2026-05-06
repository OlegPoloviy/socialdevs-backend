import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  BookmarkResponse,
  CommentLikeResponse,
  CreateCommentInput,
  CreatePostInput,
  LikeResponse,
  RepostResponse,
} from '../models/post.model';
import { PostWithRelations } from '../types/prisma.types';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly postInclude = {
    author: true,
    comments: {
      include: {
        author: true,
        likes: true,
        replies: {
          include: {
            author: true,
            likes: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc' as const,
      },
    },
    likes: {
      include: {
        user: true,
      },
    },
    bookmarks: {
      include: {
        user: true,
      },
    },
    reposts: {
      include: {
        user: true,
      },
    },
  };

  async createPost(
    userId: string,
    postInput: CreatePostInput,
  ): Promise<PostWithRelations> {
    try {
      const {
        title,
        content,
        image_urls,
        type,
        code_snippet,
        language,
        github_repo,
        demo_url,
        tags,
        difficulty,
        is_question,
        is_tutorial,
        is_showcase,
      } = postInput;

      const createdPost = await this.prisma.post.create({
        data: {
          author_id: userId,
          title,
          content,
          image_urls,
          type,
          code_snippet,
          language,
          github_repo,
          demo_url,
          tags,
          difficulty,
          is_question,
          is_tutorial,
          is_showcase,
        },
        include: this.postInclude,
      });

      return createdPost;
    } catch (err) {
      throw err;
    }
  }

  async getPosts(): Promise<PostWithRelations[]> {
    try {
      const posts = await this.prisma.post.findMany({
        include: this.postInclude,
        orderBy: {
          created_at: 'desc',
        },
      });
      return posts;
    } catch (err) {
      throw err;
    }
  }

  async getPostById(postId: string): Promise<PostWithRelations> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        include: this.postInclude,
      });

      return {
        ...post,
        likes: post.likes ?? [],
        bookmarks: post.bookmarks ?? [],
        reposts: post.reposts ?? [],
      };
    } catch (error) {
      throw error;
    }
  }

  async toggleLikePost(postId: string, userId: string): Promise<LikeResponse> {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const existingLike = await tx.like.findUnique({
          where: {
            user_id_post_id: {
              user_id: userId,
              post_id: postId,
            },
          },
        });

        if (existingLike) {
          await tx.like.delete({ where: { id: existingLike.id } });
          const post = await tx.post.update({
            where: { id: postId },
            data: { likes_count: { decrement: 1 } },
            select: { likes_count: true },
          });

          return { likes_count: post.likes_count, liked: false };
        }

        await tx.like.create({
          data: { user_id: userId, post_id: postId },
        });

        const post = await tx.post.update({
          where: { id: postId },
          data: { likes_count: { increment: 1 } },
          select: { likes_count: true },
        });

        return { likes_count: post.likes_count, liked: true };
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async createComment(userId: string, input: CreateCommentInput) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const comment = await tx.comment.create({
          data: {
            author_id: userId,
            post_id: input.post_id,
            parent_id: input.parent_id,
            content: input.content,
            code_snippet: input.code_snippet,
            language: input.language,
          },
          include: {
            author: true,
            post: true,
            parent: true,
            replies: true,
            likes: true,
          },
        });

        await tx.post.update({
          where: { id: input.post_id },
          data: { comments_count: { increment: 1 } },
        });

        return comment;
      });
    } catch (error) {
      throw error;
    }
  }

  async toggleLikeComment(
    commentId: string,
    userId: string,
  ): Promise<CommentLikeResponse> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const existingLike = await tx.like.findUnique({
          where: {
            user_id_comment_id: {
              user_id: userId,
              comment_id: commentId,
            },
          },
        });

        if (existingLike) {
          await tx.like.delete({ where: { id: existingLike.id } });
          const comment = await tx.comment.update({
            where: { id: commentId },
            data: { likes_count: { decrement: 1 } },
            select: { likes_count: true },
          });

          return { likes_count: comment.likes_count, liked: false };
        }

        await tx.like.create({
          data: { user_id: userId, comment_id: commentId },
        });

        const comment = await tx.comment.update({
          where: { id: commentId },
          data: { likes_count: { increment: 1 } },
          select: { likes_count: true },
        });

        return { likes_count: comment.likes_count, liked: true };
      });
    } catch (error) {
      throw error;
    }
  }

  async toggleBookmarkPost(
    postId: string,
    userId: string,
  ): Promise<BookmarkResponse> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const existingBookmark = await tx.bookmark.findUnique({
          where: {
            user_id_post_id: {
              user_id: userId,
              post_id: postId,
            },
          },
        });

        if (existingBookmark) {
          await tx.bookmark.delete({ where: { id: existingBookmark.id } });
          const post = await tx.post.update({
            where: { id: postId },
            data: { bookmarks_count: { decrement: 1 } },
            select: { bookmarks_count: true },
          });

          return { bookmarks_count: post.bookmarks_count, bookmarked: false };
        }

        await tx.bookmark.create({
          data: { user_id: userId, post_id: postId },
        });

        const post = await tx.post.update({
          where: { id: postId },
          data: { bookmarks_count: { increment: 1 } },
          select: { bookmarks_count: true },
        });

        return { bookmarks_count: post.bookmarks_count, bookmarked: true };
      });
    } catch (error) {
      throw error;
    }
  }

  async toggleRepostPost(
    postId: string,
    userId: string,
  ): Promise<RepostResponse> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const existingRepost = await tx.repost.findUnique({
          where: {
            user_id_post_id: {
              user_id: userId,
              post_id: postId,
            },
          },
        });

        if (existingRepost) {
          await tx.repost.delete({ where: { id: existingRepost.id } });
          const post = await tx.post.update({
            where: { id: postId },
            data: { reposts_count: { decrement: 1 } },
            select: { reposts_count: true },
          });

          return { reposts_count: post.reposts_count, reposted: false };
        }

        await tx.repost.create({
          data: { user_id: userId, post_id: postId },
        });

        const post = await tx.post.update({
          where: { id: postId },
          data: { reposts_count: { increment: 1 } },
          select: { reposts_count: true },
        });

        return { reposts_count: post.reposts_count, reposted: true };
      });
    } catch (error) {
      throw error;
    }
  }
}
