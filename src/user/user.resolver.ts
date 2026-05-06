import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import {
  UpdateUserInput,
  User,
  UserInput,
  InterestsInput,
  Follow,
  FollowResponse,
} from '../models/user.model';
import { UseGuards } from '@nestjs/common';
import { GqlJwtGuard } from '../auth/guards/gql-jwt-guard/gql-jwt-guard.guard';
import { UserService } from './user.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtUser } from '../auth/jwt-user';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  async findAllUsers() {
    return await this.userService.findAllUsers();
  }

  @UseGuards(GqlJwtGuard)
  @Query(() => User, { name: 'getUserById' })
  async findUser(@Args('id') id: string) {
    return this.userService.findUserById(id);
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() user: JwtUser,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.userService.updateUser(user.id, updateUserInput);
  }

  @Mutation(() => User)
  async deleteUser(@Args('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => User)
  async addInterests(
    @CurrentUser() user: JwtUser,
    @Args('interests') interestsInput: InterestsInput,
  ) {
    return this.userService.addUserInterests(user.id, interestsInput.interests);
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => FollowResponse)
  async toggleFollowUser(
    @CurrentUser() user: JwtUser,
    @Args('userId') userId: string,
  ): Promise<FollowResponse> {
    return this.userService.toggleFollowUser(user.id, userId);
  }

  @UseGuards(GqlJwtGuard)
  @Query(() => [Follow], { name: 'getFollowersByUserId' })
  async getFollowersByUserId(@Args('userId') userId: string) {
    return this.userService.getFollowersByUserId(userId);
  }

  @UseGuards(GqlJwtGuard)
  @Query(() => [Follow], { name: 'getFollowingByUserId' })
  async getFollowingByUserId(@Args('userId') userId: string) {
    return this.userService.getFollowingByUserId(userId);
  }
}
