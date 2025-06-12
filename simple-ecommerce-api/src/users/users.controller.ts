import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtPayload } from 'src/common/utils/types';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
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
}
