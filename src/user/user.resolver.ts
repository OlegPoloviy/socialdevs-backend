import {Resolver, Query, Args,Mutation} from '@nestjs/graphql';
import {UpdateUserInput, User, UserInput} from "../models/user.model";
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

    @Mutation(() => User)
    async createUser(@Args("createUserInput") createUserInput: UserInput) {
        return this.userService.createUser(createUserInput);
    }

    @Mutation(() => User)
    async updateUser(@Args("id")id: string,  @Args("updateUserInput") updateUserInput: UpdateUserInput){
        return this.userService.updateUser(id, updateUserInput);

    }

    @Mutation(() => User)
    async deleteUser(@Args("id") id: string) {
        return this.userService.deleteUser(id)
    }
}
