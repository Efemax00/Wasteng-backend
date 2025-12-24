// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../entities/users/user/users.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../admin/admin.entity';
import {AdminService} from "./admin.service";
import { CompanyModule } from '../entities/companies/company/company.module';
import { AdminVerificationController } from './admin-verification.controller';
import { CompanyVerificationModule } from '../entities/companies/company-verification/company-verification.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Admin,]), 
    UsersModule,
    CompanyModule,
    CompanyVerificationModule,
     AuthModule],
  controllers: [AdminController],
  providers: [AdminService, AdminVerificationController],
})
export class AdminModule {}
