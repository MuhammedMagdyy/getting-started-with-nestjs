import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtPayload } from 'src/common/utils/types';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/user-role.decorator';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserType } from './enums/user-type.enum';
import { AuthRolesGuard } from './guards/auth-roles.guards';
import { AuthGuard } from './guards/auth.guard';
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth/register')
  async register(@Body() body: RegisterDto) {
    return this.usersService.register(body);
  }

  @Post('/auth/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    return this.usersService.login(body);
  }

  @Get('/current-user')
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
}
