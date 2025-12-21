import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsInt,
  IsUrl,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PrimaryContactDto } from '../../../../entities/companies/company/dto/primary-contact.dto';

export class CreateCompanyDto {
  /* =====================
     AUTH / CORE
     ===================== */

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  companyName: string;

  @IsString()
  registrationNumber: string;

  /* =====================
     BRANDING
     ===================== */

  @IsOptional()
  @IsString()
  companyLogo?: string;

  @IsOptional()
  @IsString()
  name?: string;

  /* =====================
     CONTACT INFO
     ===================== */

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  /* =====================
     BUSINESS INFO
     ===================== */

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  yearEstablished?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  numberOfEmployees?: number;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  licenseExpiry?: string;

  /* =====================
     OPERATIONS
     ===================== */

  @IsOptional()
  @IsString()
  operatingStates?: string;

  @IsOptional()
  @IsString()
  operatingHours?: string;

  @IsOptional()
  @IsString()
  workingDays?: string;

  @IsOptional()
  @IsString()
  serviceRadius?: string;

  @IsOptional()
  @IsString()
  responseTime?: string;

  @IsOptional()
  @IsString()
  minCollection?: string;

  @IsOptional()
  @IsString()
  vehicleFleet?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PrimaryContactDto)
  primaryContact?: PrimaryContactDto;
}
