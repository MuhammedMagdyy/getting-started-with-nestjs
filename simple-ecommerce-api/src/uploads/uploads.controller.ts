import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';

@Controller('/api/uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'File is not provided or is invalid. Please upload a valid file.',
      );
    }

    return { message: 'File uploaded successfully' };
  }

  @Post('/multiple-files')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException(
        'Files are not provided or are invalid. Please upload valid files.',
      );
    }

    return { message: 'Files uploaded successfully' };
  }

  @Get('/:image')
  getImage(@Param('image') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: 'images' });
  }
}
