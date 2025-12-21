// src/company/profile/dto/update-company.dto.ts
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateCompanyDto {

  @IsOptional()
   companyName?: string;
   
  @IsOptional()
   phone?: string;


  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
   licenseNumber?: string;

  @IsOptional()
   taxId?: string;

  // optional structured objects
  @IsOptional()
   serviceData?: any;


  @IsOptional()
   operationData?: any;


  @IsOptional()
   notificationPreferences?: any;
}
