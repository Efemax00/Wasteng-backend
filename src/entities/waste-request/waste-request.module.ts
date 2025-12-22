import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WasteRequest } from './waste-request.entity';
import { WasteRequestService } from './waste-request.service';
import { WasteRequestController } from './waste-request.controller';
import { Company } from '../companies/company/company.entity';
import { User } from '../users/user/user.entity';
import { WasteRequestRejection } from './waste-request-rejection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WasteRequest, Company, User, WasteRequestRejection])],
  providers: [WasteRequestService],
  controllers: [WasteRequestController],
  exports: [WasteRequestService],
})
export class WasteRequestModule {}

