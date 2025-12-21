// primary-contact.dto.ts
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class PrimaryContactDto {
  @IsString()
  fullName: string;

  @IsString()
  position: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;
}
