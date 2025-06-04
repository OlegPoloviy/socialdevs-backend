import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import { AppService } from './app.service';
import * as path from "node:path";

@Module({
  imports: [
      GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          graphiql: true,
          autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
