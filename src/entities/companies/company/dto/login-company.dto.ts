import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginCompanyDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  registrationNumber?: string; // optional for login
}

