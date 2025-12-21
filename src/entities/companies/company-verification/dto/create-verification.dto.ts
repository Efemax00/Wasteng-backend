import { IsNotEmpty } from 'class-validator';

export class CreateVerificationDto {
  @IsNotEmpty()
  documentUrl: string;
}
