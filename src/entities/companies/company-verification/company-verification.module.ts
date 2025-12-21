import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyVerificationController } from '../../../entities/companies/company-verification/company-verification.controller';
import { CompanyVerificationService } from '../../../entities/companies/company-verification/company-verification.service';
import { VerificationRequest } from '../../../entities/companies/company-verification/entities/verification-request.entity';
import { Company } from '../../../entities/companies/company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationRequest, Company])],
  controllers: [CompanyVerificationController],
  providers: [CompanyVerificationService],
  exports: [CompanyVerificationService], // export if used elsewhere
})
export class CompanyVerificationModule {}
