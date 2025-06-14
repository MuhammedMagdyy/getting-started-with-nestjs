import { BadRequestException, forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { AuthModule } from 'src/auth/auth.module';
import { MAX_FILE_SIZE } from 'src/common/utils/constants';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    MulterModule.register({
      storage: diskStorage({
        destination: './images/users',
        filename: (_req, file, cb) => {
          const prefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileName = `${prefix}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Invalid file type. Only JPEG, PNG, and JPG files are allowed.',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    }),
  ],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
