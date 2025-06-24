import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserInput, User, UserInput } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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
        include: {
          posts: true,
          comments: true,
          likes: true,
          bookmarks: true,
        },
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
        include: {
          posts: true,
          comments: true,
          likes: true,
          bookmarks: true,
        },
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
        include: {
          posts: true,
          comments: true,
          likes: true,
          bookmarks: true,
        },
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
        include: {
          posts: true,
          comments: true,
          likes: true,
          bookmarks: true,
        },
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
        include: {
          posts: true,
          comments: true,
          likes: true,
          bookmarks: true,
        },
      });
      return this.mapPrismaUserToGraphQLUser(userWithInterests);
    } catch (error) {
      console.error('Error updating user interests:', error);
      throw new Error('Failed to update user interests');
    }
  }
}
