import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import {UpdateUserInput, User, UserInput} from "../models/user.model";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async findAllUsers(): Promise<User[]> {
        try {
            const users = await this.prisma.user.findMany();
            return users;
        } catch (err) {
            console.error('Error with getting users:', err);
            throw err;
        }
    }

    async findUserById(id: string): Promise<User> {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });

            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            return user;
        } catch (err) {
            if (err instanceof NotFoundException) {
                throw err;
            }

            console.error('Error with getting user by id:', err);
            throw err;
        }
    }


    async updateUser(id: string,updateUserInput: UpdateUserInput): Promise<User>{
        try{
            const updated = await this.prisma.user.update({
                where: {id: id},
                data: updateUserInput,
            })

            return updated;
        }catch(err){
            console.error('Error with updating user:', err);
        }
    }

    async deleteUser(id: string): Promise<User> {
        try {
            const deleted = await this.prisma.user.delete({ where: { id } });
            return deleted;
        } catch (err) {
            console.error('Error with deleting user:', err);
        }
    }
}