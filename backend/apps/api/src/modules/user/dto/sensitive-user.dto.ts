import { IsEmail, IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class SensitiveUserDto {
  @IsEmail()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  nick_name?: string;

  @IsDate()
  @Type(() => Date)
  dob: Date;

  @IsString()
  zipcode: string;

  // Sensitive fields that should be encrypted
  // Note: @Encrypt decorator would be applied at the controller level
  // or through a custom transformer in a real implementation
  @IsOptional()
  @IsString()
  ssn?: string;

  @IsOptional()
  @IsString()
  creditCardNumber?: string;

  @IsOptional()
  @IsString()
  bankAccountNumber?: string;
}

export class DecryptUserDto {
  @IsEmail()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  nick_name?: string;

  @IsDate()
  @Type(() => Date)
  dob: Date;

  @IsString()
  zipcode: string;

  // Sensitive fields that should be decrypted when retrieved
  // Note: @Decrypt decorator would be applied at the controller level
  // or through a custom transformer in a real implementation
  @IsOptional()
  @IsString()
  ssn?: string;

  @IsOptional()
  @IsString()
  creditCardNumber?: string;

  @IsOptional()
  @IsString()
  bankAccountNumber?: string;
}
