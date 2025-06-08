import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserInput, SignInInput, User } from '../models/user.model';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './auth.jwt';
import { hash, compare } from "bcrypt"

export type LoginResponse = {
  id: string;
  email: string;
  accessToken: string;
}



@Injectable()
export class AuthService {
  constructor( private readonly prisma: PrismaService, private readonly  jwtService: JwtService) {}

  async registerUser(input: UserInput){
      const hashedPassword = await hash(input.password, 10);
      try{
        const newUser = this.prisma.user.create({
          data: {...input, password: hashedPassword},
        })
        return newUser;
      }catch(err){
        console.log(err);
        throw err;
      }
  }

  async validateUser(input: SignInInput){
      try{
        const existingUser = await this.prisma.user.findUnique({
          where: { email: input.email },
        })

        if(!existingUser){
          throw new UnauthorizedException("User don`t exist");
        }

        const passwordMatch = await compare(input.password,existingUser.password)

        if(!passwordMatch){
          throw new UnauthorizedException("Invalid password");
        }

        return existingUser;
      }catch(err){
        console.log(err);
        throw err;
      }
  }

  async generateToken(userId: string, email: string){
      const payload: AuthJwtPayload = {
        sub: userId,
        email: email
      }

      const accessToken = await this.jwtService.signAsync(payload);

      return { accessToken };
  }

  async login(user: User): Promise<LoginResponse> {
    const { accessToken } = await this.generateToken(user.id, user.email);

    return {
      id: user.id,
      email: user.email,
      accessToken,
    }
  }
}
