import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MAX_FILE_SIZE } from 'src/common/utils/constants';
import { UploadsController } from './uploads.controller';

@Module({
  controllers: [UploadsController],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './images',
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
})
export class UploadsModule {}
