import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { AccessToken, JwtPayload } from 'src/common/utils/types';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
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

  async hashPassword(password: string): Promise<string> {
    const hashSaltRounds = this.configService.get<string>('HASH_SALT_ROUNDS');
    const salt = await genSalt(Number(hashSaltRounds));
    return await hash(password, salt);
  }

  private async generateJwtToken(jwtPayload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(jwtPayload);
  }
}
