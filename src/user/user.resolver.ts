import { Resolver, Query } from '@nestjs/graphql';
import {User} from "../models/user.model";
import {UserService} from "./user.service";

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => [User], {name: 'users'})
    async findAllUsers() {
        return await this.userService.findAllUsers();
    }
}
