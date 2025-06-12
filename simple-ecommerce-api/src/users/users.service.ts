import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, username } = registerDto;
    const userExists = await this.userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException(`User with email ${email} already exists.`);
    }

    const hashSaltRounds = this.configService.get<string>('HASH_SALT_ROUNDS');
    const salt = await genSalt(Number(hashSaltRounds));
    const hashedPassword = await hash(password, salt);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      username,
    });

    // TODO: Generate JWT token
    return await this.userRepository.save(newUser);
  }
}
