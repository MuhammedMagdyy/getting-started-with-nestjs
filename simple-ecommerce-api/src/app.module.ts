import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';
import { Review } from './reviews/entities/review.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { UploadsModule } from './uploads/uploads.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ProductsModule,
    ReviewsModule,
    UsersModule,
    AuthModule,
    UploadsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          database: config.get<string>('DB_NAME'),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          port: config.get<number>('DB_PORT'),
          host: config.get<string>('DB_HOST'),
          synchronize: process.env.NODE_ENV !== 'production',
          entities: [Product, Review, User],
        };
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
