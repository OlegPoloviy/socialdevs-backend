import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as path from "node:path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
      GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          graphiql: true,
          autoSchemaFile: true,
          playground: true,
      }),
      UserModule,
      PrismaModule,
      AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
