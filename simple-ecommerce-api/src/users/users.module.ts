import { forwardRef, Module } from '@nestjs/common';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [forwardRef(() => ReviewsModule)],
})
export class UsersModule {}
