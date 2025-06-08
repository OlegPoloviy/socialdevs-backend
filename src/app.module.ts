import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import * as path from "node:path";

@Module({
  imports: [
      GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          graphiql: true,
          autoSchemaFile: true,
          playground: true,
      }),
      UserModule,
      PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
