import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserInput, SignInInput, User } from '../models/user.model';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './auth.jwt';
import { hash, compare } from 'bcrypt';
import { JwtUser } from './jwt-user';
import { AuthProvider as LocalAuthProvider } from '../models/enums/user.enum';
import { Prisma } from '@prisma/client';

export type LoginResponse = {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  accessToken: string;
  expiresAt?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private mapPrismaUserToGraphQLUser(user: any): User {
    return {
      ...user,
      skills: user.skills ?? [],
      interests: user.interests ?? [],
      posts: user.posts ?? [],
      comments: user.comments ?? [],
      likes: user.likes ?? [],
      bookmarks: user.bookmarks ?? [],
      following: user.following ?? [],
      followers: user.followers ?? [],
      followers_count: user.followers_count ?? 0,
      following_count: user.following_count ?? 0,
      provider: user.provider as LocalAuthProvider,
    };
  }

  async registerUser(input: UserInput) {
    const hashedPassword = await hash(input.password, 10);
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: input.email,
          username: input.username,
          password: hashedPassword,
          skills: [],
          interests: [],
        },
        include: {
          posts: true,
          comments: true,
          likes: true,
          bookmarks: true,
          following: true,
          followers: true,
        },
      });
      return this.mapPrismaUserToGraphQLUser(newUser);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException('Email or username already exists');
      }

      throw err;
    }
  }

  async validateUser(input: SignInInput) {
    try {
      if (!input.email && !input.username) {
        throw new UnauthorizedException('User don`t exist');
      }

      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            ...(input.email ? [{ email: input.email }] : []),
            ...(input.username ? [{ username: input.username }] : []),
          ],
        },
        include: {
          posts: true,
          comments: true,
          likes: true,
          bookmarks: true,
          following: true,
          followers: true,
        },
      });

      if (!existingUser) {
        throw new UnauthorizedException('User don`t exist');
      }

      const passwordMatch = await compare(
        input.password,
        existingUser.password,
      );

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid password');
      }

      return this.mapPrismaUserToGraphQLUser(existingUser);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async generateToken(userId: string, email: string, avatar_url?: string) {
    const payload: AuthJwtPayload = {
      sub: userId,
      email: email,
      avatar_url: avatar_url,
    };

    console.log('Creating JWT with payload:', payload);

    const expiresIn = '24h';
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: expiresIn,
    });

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    return { accessToken, expiresAt };
  }

  async login(user: User): Promise<LoginResponse> {
    const { accessToken, expiresAt } = await this.generateToken(
      user.id,
      user.email,
      user.avatar_url,
    );

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar_url: user.avatar_url,
      accessToken,
      expiresAt,
    };
  }

  async validateUserJwt(userId: string): Promise<JwtUser | null> {
    console.log('Validating JWT user with ID:', userId);

    if (!userId) {
      console.log('No userId provided to validateUserJwt');
      return null;
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      console.log('Found user in database:', user ? 'Yes' : 'No');

      if (!user) {
        console.log('User not found in database for ID:', userId);
        return null;
      }

      const jwtUser: JwtUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
      };

      console.log('Returning JWT user:', jwtUser);
      return jwtUser;
    } catch (error) {
      console.error('Error in validateUserJwt:', error);
      return null;
    }
  }
}
