import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Follow,
  FollowResponse,
  UpdateUserInput,
  User,
  UserInput,
} from '../models/user.model';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userInclude = {
    posts: {
      include: {
        author: true,
        comments: {
          include: {
            author: true,
            likes: true,
          },
        },
        likes: true,
        bookmarks: true,
        reposts: true,
      },
    },
    comments: true,
    likes: true,
    bookmarks: true,
    reposts: {
      include: {
        post: {
          include: {
            author: true,
            comments: {
              include: {
                author: true,
                likes: true,
              },
            },
            likes: true,
            bookmarks: true,
            reposts: true,
          },
        },
      },
    },
    following: {
      include: {
        following: true,
      },
    },
    followers: {
      include: {
        follower: true,
      },
    },
  };

  private mapPrismaUserToGraphQLUser(user: any): User {
    return {
      ...user,
      provider:
        user.provider as import('../models/enums/user.enum').AuthProvider,
    };
  }

  async findAllUsers(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany({
        include: this.userInclude,
      });
      return users.map(this.mapPrismaUserToGraphQLUser);
    } catch (err) {
      console.error('Error with getting users:', err);
      throw err;
    }
  }

  async findUserById(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: this.userInclude,
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return this.mapPrismaUserToGraphQLUser(user);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }

      console.error('Error with getting user by id:', err);
      throw err;
    }
  }

  async updateUser(
    id: string,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    try {
      const updated = await this.prisma.user.update({
        where: { id: id },
        data: updateUserInput,
        include: this.userInclude,
      });

      return this.mapPrismaUserToGraphQLUser(updated);
    } catch (err) {
      console.error('Error with updating user:', err);
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      const deleted = await this.prisma.user.delete({
        where: { id },
        include: this.userInclude,
      });
      return this.mapPrismaUserToGraphQLUser(deleted);
    } catch (err) {
      console.error('Error with deleting user:', err);
    }
  }

  async addUserInterests(userId: string, interests: string[]): Promise<User> {
    try {
      const userWithInterests = await this.prisma.user.update({
        where: { id: userId },
        data: { interests },
        include: this.userInclude,
      });
      return this.mapPrismaUserToGraphQLUser(userWithInterests);
    } catch (error) {
      console.error('Error updating user interests:', error);
      throw new Error('Failed to update user interests');
    }
  }

  async toggleFollowUser(
    currentUserId: string,
    targetUserId: string,
  ): Promise<FollowResponse> {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!targetUser) {
      throw new NotFoundException(`User with ID ${targetUserId} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      const existingFollow = await tx.follow.findUnique({
        where: {
          follower_id_following_id: {
            follower_id: currentUserId,
            following_id: targetUserId,
          },
        },
      });

      if (existingFollow) {
        await tx.follow.delete({ where: { id: existingFollow.id } });

        const [currentUser, target] = await Promise.all([
          tx.user.update({
            where: { id: currentUserId },
            data: { following_count: { decrement: 1 } },
            select: { following_count: true },
          }),
          tx.user.update({
            where: { id: targetUserId },
            data: { followers_count: { decrement: 1 } },
            select: { followers_count: true },
          }),
        ]);

        return {
          followers_count: target.followers_count,
          following_count: currentUser.following_count,
          following: false,
        };
      }

      await tx.follow.create({
        data: {
          follower_id: currentUserId,
          following_id: targetUserId,
        },
      });

      const [currentUser, target] = await Promise.all([
        tx.user.update({
          where: { id: currentUserId },
          data: { following_count: { increment: 1 } },
          select: { following_count: true },
        }),
        tx.user.update({
          where: { id: targetUserId },
          data: { followers_count: { increment: 1 } },
          select: { followers_count: true },
        }),
      ]);

      return {
        followers_count: target.followers_count,
        following_count: currentUser.following_count,
        following: true,
      };
    });
  }

  async getFollowersByUserId(userId: string): Promise<any[]> {
    await this.ensureUserExists(userId);

    return this.prisma.follow.findMany({
      where: { following_id: userId },
      include: {
        follower: true,
        following: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getFollowingByUserId(userId: string): Promise<any[]> {
    await this.ensureUserExists(userId);

    return this.prisma.follow.findMany({
      where: { follower_id: userId },
      include: {
        follower: true,
        following: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  private async ensureUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }
}
