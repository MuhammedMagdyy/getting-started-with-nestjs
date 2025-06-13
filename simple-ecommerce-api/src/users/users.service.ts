import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { AccessToken, JwtPayload } from 'src/common/utils/types';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UserType } from './enums/user-type.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AccessToken> {
    const { email, password, username } = registerDto;
    const userExists = await this.userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException(`User with email ${email} already exists.`);
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      username,
    });

    await this.userRepository.save(newUser);

    const token = await this.generateJwtToken({
      id: newUser.id,
      userType: newUser.userType,
    });
    return { token };
  }

  async login(loginDto: LoginDto): Promise<AccessToken> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateJwtToken({
      id: user.id,
      userType: user.userType,
    });
    return { token };
  }

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
      user.password = await this.hashPassword(password);
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

  private async generateJwtToken(jwtPayload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(jwtPayload);
  }

  private async hashPassword(password: string): Promise<string> {
    const hashSaltRounds = this.configService.get<string>('HASH_SALT_ROUNDS');
    const salt = await genSalt(Number(hashSaltRounds));
    return hash(password, salt);
  }
}
