// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../entities/users/user/users.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../admin/admin.entity';
import {AdminService} from "./admin.service";
import { CompanyModule } from '../entities/companies/company/company.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Admin,]), 
    UsersModule,
    CompanyModule,
     AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
