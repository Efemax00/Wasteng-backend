import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminWasteService } from './admin-waste.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/waste-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminWasteController {
  constructor(private readonly adminWasteService: AdminWasteService) {}

  @Get()
  getAllRequests() {
    return this.adminWasteService.getAllRequests();
  }

  @Get('status/:status')
  getRequestsByStatus(@Param('status') status: string) {
    return this.adminWasteService.getRequestsByStatus(
      status as 'pending' | 'accepted' | 'rejected' | 'enroute' | 'completed',
    );
  }

  @Patch('assign/:id')
  async assignCompany(
    @Param('id') requestId: string,
    @Body('companyId') companyId: number,
  ) {
    const idNum = Number(requestId);
    return this.adminWasteService.assignCompany(idNum, companyId);
  }

  @Delete(':id')
  async deleteRequest(@Param('id') requestId: string) {
    const idNum = Number(requestId);
    return this.adminWasteService.deleteRequest(idNum);
  }
}
