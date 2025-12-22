import { IsNotEmpty, IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class CreateVerificationDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  documentUrls: string[];
}
