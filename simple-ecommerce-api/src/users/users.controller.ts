import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { diskStorage } from 'multer';
import { AuthRolesGuard } from 'src/auth/guards/auth-roles.guards';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { MAX_FILE_SIZE } from 'src/common/utils/constants';
import { JwtPayload } from 'src/common/utils/types';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/user-role.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserType } from './enums/user-type.enum';
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@CurrentUser() payload: JwtPayload) {
    return this.usersService.getCurrentUser(payload.id);
  }

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  async findAll() {
    return this.usersService.findAll();
  }

  @Put()
  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  async updateUser(
    @CurrentUser() payload: JwtPayload,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(payload.id, body);
  }

  @Delete('/:id')
  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.usersService.delete(id, payload);
  }

  @Post('/images/upload-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
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
  )
  uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() payload: JwtPayload,
  ) {
    if (!file) {
      throw new BadRequestException(
        'File is not provided or is invalid. Please upload a valid file.',
      );
    }

    return this.usersService.setProfilePicture(payload.id, file.filename);
  }

  @Delete('/images/remove-image')
  @UseGuards(AuthGuard)
  async removeProfilePicture(@CurrentUser() payload: JwtPayload) {
    return this.usersService.removeProfilePicture(payload.id);
  }

  @Get('/images/:image')
  @UseGuards(AuthGuard)
  getProfilePicture(@Param('image') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: 'images/users' });
  }
}
