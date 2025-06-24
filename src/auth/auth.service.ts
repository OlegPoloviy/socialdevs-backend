import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserInput, SignInInput, User } from '../models/user.model';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './auth.jwt';
import { hash, compare } from 'bcrypt';
import { JwtUser } from './jwt-user';
import { AuthProvider as LocalAuthProvider } from '../models/enums/user.enum';

export type LoginResponse = {
  id: string;
  email: string;
  username: string;
  accessToken: string;
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
      provider: user.provider as LocalAuthProvider,
    };
  }

  async registerUser(input: UserInput) {
    const hashedPassword = await hash(input.password, 10);
    try {
      const newUser = await this.prisma.user.create({
        data: { ...input, password: hashedPassword },
        include: {
          posts: true,
          comments: true,
          likes: true,
          bookmarks: true,
        },
      });
      return this.mapPrismaUserToGraphQLUser(newUser);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async validateUser(input: SignInInput) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: input.email },
        include: {
          posts: true,
          comments: true,
          likes: true,
          bookmarks: true,
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

  async generateToken(userId: string, email: string) {
    const payload: AuthJwtPayload = {
      sub: userId,
      email: email,
    };

    console.log('Creating JWT with payload:', payload); // Додаткове логування

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async login(user: User): Promise<LoginResponse> {
    const { accessToken } = await this.generateToken(user.id, user.email);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken,
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
      };

      console.log('Returning JWT user:', jwtUser);
      return jwtUser;
    } catch (error) {
      console.error('Error in validateUserJwt:', error);
      return null;
    }
  }
}
