import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  // This will use pipes injected into routes not global pipes
  // @Length(3, 20, { groups: ['create'] })
  // @Length(6, 20, { groups: ['update'] })
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly country: string;
}
