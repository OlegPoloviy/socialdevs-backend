import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { User, UserInput, SignInInput } from '../models/user.model';
import { AuthService } from './auth.service';
import { AuthPayload } from './entities/auth-payload';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async signUp(@Args('input') input: UserInput): Promise<User> {
    return await this.authService.registerUser(input);
  }

  @Mutation(() => AuthPayload)
  async signIn(@Args('input') input: SignInInput): Promise<AuthPayload> {
    try {
      const user = await this.authService.validateUser(input);

      const loginResponse = await this.authService.login(user);

      return {
        userId: loginResponse.id,
        username: loginResponse.username,
        email: loginResponse.email,
        accessToken: loginResponse.accessToken,
      };
    } catch (error) {
      throw error;
    }
  }
}