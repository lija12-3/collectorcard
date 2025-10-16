import { IsEmail, IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  nick_name?: string;

  @Type(() => Date)
  @IsDate()
  dob: Date;

  @IsString()
  zipcode: string;
}
