import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './users.entity';

@Injectable()
export class UserService {
  private users: UserEntity[] = [];

  findAll(): UserEntity[] {
    return this.users;
  }

  findUserById(id: string): UserEntity {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  createUser(createUserDto: CreateUserDto): UserEntity {
    const user: UserEntity = {
      id: Math.random().toString(10).substring(2),
      ...createUserDto,
    };
    this.users.push(user);
    return user;
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): UserEntity {
    const idx = this.users.findIndex((user) => user.id === id);
    if (idx === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    // This overrides the current entity
    this.users[idx] = { ...this.users[idx], ...updateUserDto };

    return this.users[idx];
  }

  deleteUser(id: string): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
