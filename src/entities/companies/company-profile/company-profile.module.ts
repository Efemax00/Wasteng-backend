import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyProfileController } from '../../../entities/companies/company-profile/company-profile.controller';
import { CompanyProfileService } from '../../../entities/companies/company-profile/company-profile.service';
import { Company } from '../../../entities/companies/company/company.entity';
import { CloudinaryModule } from '../../../entities/companies/company/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), CloudinaryModule],
  controllers: [CompanyProfileController],
  providers: [CompanyProfileService],
  exports: [CompanyProfileService],
})
export class CompanyProfileModule {}
