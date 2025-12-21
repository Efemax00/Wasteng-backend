import { IsString } from 'class-validator';

export class DeleteCompanyDto {
  @IsString()
  password: string;
}
