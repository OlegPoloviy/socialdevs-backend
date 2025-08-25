import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostInput, LikeResponse } from '../models/post.model';
import { PostWithRelations } from '../types/prisma.types';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

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
        // Include relations для GraphQL типу
        include: {
          author: true,
          comments: {
            include: {
              author: true,
              likes: true,
              replies: true,
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
        },
      });

      return createdPost;
    } catch (err) {
      throw err;
    }
  }

  async getPosts(): Promise<PostWithRelations[]> {
    try {
      const posts = await this.prisma.post.findMany({
        include: {
          author: true,
          comments: {
            include: {
              author: true,
              likes: true,
              replies: true,
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
        include: {
          author: true,
          comments: {
            include: {
              author: true,
              likes: true,
              replies: true,
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
        },
      });

      return {
        ...post,
        likes: post.likes ?? [],
      };
    } catch (error) {
      throw error;
    }
  }

  async toggleLikePost(postId: string, userId: string): Promise<LikeResponse> {
    try {
      const existingLike = await this.prisma.like.findUnique({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
      });

      let post;

      if (existingLike) {
        await this.prisma.like.delete({ where: { id: existingLike.id } });
        post = await this.prisma.post.update({
          where: { id: postId },
          data: { likes_count: { decrement: 1 } },
          select: { likes_count: true },
        });
      } else {
        await this.prisma.like.create({
          data: { user_id: userId, post_id: postId },
        });
        post = await this.prisma.post.update({
          where: { id: postId },
          data: { likes_count: { increment: 1 } },
          select: { likes_count: true },
        });
      }

      const isLiked = !existingLike;

      return { likes_count: post.likes_count, liked: isLiked };
    } catch (error) {
      throw error;
    }
  }
}
