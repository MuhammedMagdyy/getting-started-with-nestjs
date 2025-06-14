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
import { AuthRolesGuard } from 'src/auth/guards/auth-roles.guards';
import { AuthGuard } from 'src/auth/guards/auth.guard';
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
  @UseInterceptors(FileInterceptor('image'))
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
