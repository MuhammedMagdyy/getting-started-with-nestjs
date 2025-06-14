import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/common/utils/types';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UserType } from './enums/user-type.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async getCurrentUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { username, password } = updateUserDto;
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.username = username ?? user.username;

    if (password) {
      user.password = await this.authService.hashPassword(password);
    }

    await this.userRepository.save(user);
    return user;
  }

  async delete(id: number, payload: JwtPayload): Promise<{ message: string }> {
    const user = await this.getCurrentUser(id);

    if (
      user.id !== payload.id &&
      (payload.userType.toUpperCase() as UserType) !== UserType.ADMIN
    ) {
      throw new ForbiddenException(
        'You do not have permission to delete this user.',
      );
    }

    await this.userRepository.delete(id);
    return { message: 'User deleted successfully.' };
  }

  async setProfilePicture(userId: number, profileImage: string) {
    const user = await this.getCurrentUser(userId);

    if (user.profilePicture) {
      await this.removeProfilePicture(userId);
    }

    user.profilePicture = profileImage;
    return await this.userRepository.save(user);
  }

  async removeProfilePicture(userId: number) {
    const user = await this.getCurrentUser(userId);
    if (!user.profilePicture) {
      throw new BadRequestException('No profile picture found for this user');
    }
    const imagePath = join(
      process.cwd(),
      `./images/users/${user.profilePicture}`,
    );
    unlinkSync(imagePath);
    user.profilePicture = null;
    return await this.userRepository.save(user);
  }
}
