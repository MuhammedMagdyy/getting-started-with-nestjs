import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';
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

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // TODO: Generate JWT token
    return user;
  }
}
