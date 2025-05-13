import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './user.entity';

@Controller('users')
export class UsersController {
  private users: UserEntity[] = [];

  @Get('/')
  findAll(): UserEntity[] {
    return this.users;
  }

  @Get('/:id')
  findOne(@Param('id') id: string): UserEntity {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const user: UserEntity = {
      id: Math.random().toString(10).substring(2),
      ...createUserDto,
    };
    this.users.push(user);
    return user;
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const idx = this.users.findIndex((user) => user.id === id);
    if (idx === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    // This overrides the current entity
    this.users[idx] = { ...this.users[idx], ...updateUserDto };

    return this.users[idx];
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
