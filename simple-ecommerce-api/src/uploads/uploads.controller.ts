import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { diskStorage } from 'multer';
import { MAX_FILE_SIZE } from 'src/common/utils/constants';

@Controller('/api/uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
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
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'File is not provided or is invalid. Please upload a valid file.',
      );
    }

    return { message: 'File uploaded successfully' };
  }

  @Get('/:image')
  getImage(@Param('image') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: 'images' });
  }
}
