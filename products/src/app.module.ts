import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { BullModule } from '@nestjs/bull';

import { ProductModule } from './products/product.module';
import { AuthModule } from './auth/auth.module';
import configuration from '../config/configuration';
import { ImageModule } from './images/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: 'products-microservice',
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
        password: '123',
      },
    }),
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ProductModule,
    ImageModule,
  ],
})
export class AppModule {}
