import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {User} from "../models/user.model";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService){}

    async findAllUsers(): Promise<User[]>{
        try{
            const users = await this.prisma.user.findMany();
            return users;
        }catch(err){
            console.error('Error with getting users:', err);
            throw err;
        }
    }
}
