import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateWasteRequestDto {
  @IsNotEmpty()
  @IsString()
  wasteType: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsDateString()
  preferredDate: string;
}
