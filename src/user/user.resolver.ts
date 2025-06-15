import {Resolver, Query, Args,Mutation} from '@nestjs/graphql';
import {UpdateUserInput, User, UserInput} from "../models/user.model";
import {UseGuards} from '@nestjs/common';
import {GqlJwtGuardGuard} from '../auth/guards/gql-jwt-guard/gql-jwt-guard.guard';
import {UserService} from "./user.service";

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => [User], {name: 'users'})
    async findAllUsers() {
        return await this.userService.findAllUsers();
    }

    @Query(() => User, {name: 'getUserById'})
    async findUser(@Args('id') id: string) {
        return this.userService.findUserById(id);
    }


    @UseGuards(GqlJwtGuardGuard)
    @Mutation(() => User)
    async updateUser(@Args("id")id: string,  @Args("updateUserInput") updateUserInput: UpdateUserInput){
        return this.userService.updateUser(id, updateUserInput);

    }

    @Mutation(() => User)
    async deleteUser(@Args("id") id: string) {
        return this.userService.deleteUser(id)
    }
}
