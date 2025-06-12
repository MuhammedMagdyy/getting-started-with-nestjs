import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ProductsModule,
    ReviewsModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'simple_ecommerce_db',
      username: 'postgres',
      password: 'mysecretpassword',
      port: 5432,
      host: 'localhost',
      synchronize: true, // TODO: Set to false in production
      entities: [Product],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
