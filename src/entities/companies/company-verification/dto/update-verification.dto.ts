import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateVerificationDto {
  @IsIn(['approved', 'rejected'])
  status: 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  adminNotes?: string;
  rejectionReason: string;
}
