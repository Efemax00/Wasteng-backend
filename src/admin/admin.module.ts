// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../entities/users/user/users.module'; // if needed
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../admin/admin.entity';
import {AdminsService} from "../admin/admins.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]), 
    UsersModule,
     AuthModule],
  controllers: [AdminController],
  providers: [AdminsService],
})
export class AdminModule {}
