import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminWasteController } from './admin-waste.controller';
import { AdminWasteService } from './admin-waste.service';
import { WasteRequest } from '../entities/waste-request/waste-request.entity';
import { UsersModule } from '../entities/users/user/users.module';
import { CompanyModule } from '../entities/companies/company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WasteRequest]),
    UsersModule,
    CompanyModule,
  ],
  controllers: [AdminWasteController],
  providers: [AdminWasteService],
})
export class AdminWasteModule {}
