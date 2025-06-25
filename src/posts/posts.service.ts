import { Injectable } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import { CreatePostInput} from '../models/post.model';
import { PostWithRelations } from '../types/prisma.types';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(userId: string, postInput: CreatePostInput): Promise<PostWithRelations> {
    try {
      const {
        title,
        content,
        type,
        code_snippet,
        language,
        github_repo,
        demo_url,
        tags,
        difficulty,
        is_question,
        is_tutorial,
        is_showcase
      } = postInput;

      const createdPost = await this.prisma.post.create({
        data: {
          author_id: userId,
          title,
          content,
          type,
          code_snippet,
          language,
          github_repo,
          demo_url,
          tags,
          difficulty,
          is_question,
          is_tutorial,
          is_showcase
        },
        // Include relations для GraphQL типу
        include: {
          author: true,
          comments: {
            include: {
              author: true,
              likes: true,
              replies: true
            }
          },
          likes: {
            include: {
              user: true
            }
          },
          bookmarks: {
            include: {
              user: true
            }
          }
        }
      });

      return createdPost;
    } catch (err) {
      throw err;
    }
  }

  async getPosts(): Promise<PostWithRelations[]> {
      try{
        const posts = await this.prisma.post.findMany({
          include: {
            author: true,
            comments: {
              include: {
                author: true,
                likes: true,
                replies: true
              }
            },
            likes: {
              include: {
                user: true
              }
            },
            bookmarks: {
              include: {
                user: true
              }
            }
          }});
        return posts;
      }catch(err){
        throw err;
      }
  }
}
