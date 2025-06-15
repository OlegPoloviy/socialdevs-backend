import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import {UpdateUserInput, User, UserInput} from "../models/user.model";
import {UseGuards} from '@nestjs/common';
import {GqlJwtGuard} from '../auth/guards/gql-jwt-guard/gql-jwt-guard.guard';
import {UserService} from "./user.service";
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtUser } from '../auth/jwt-user';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => [User], {name: 'users'})
    async findAllUsers() {
        return await this.userService.findAllUsers();
    }

    @UseGuards(GqlJwtGuard)
    @Query(() => User, {name: 'getUserById'})
    async findUser(@Args('id') id: string) {
        return this.userService.findUserById(id);
    }


    @UseGuards(GqlJwtGuard)
    @Mutation(() => User)
    async updateUser(@CurrentUser() user: JwtUser,  @Args("updateUserInput") updateUserInput: UpdateUserInput){

        console.log(user);
        return this.userService.updateUser(user.id, updateUserInput);

    }

    @Mutation(() => User)
    async deleteUser(@Args("id") id: string) {
        return this.userService.deleteUser(id)
    }
}
