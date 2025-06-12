import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;
}
