import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Param,
  Patch,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { WasteRequestService } from './waste-request.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { User } from '../users/user/user.entity';
import { Company } from '../companies/company/company.entity';

@Controller('waste-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WasteRequestController {
  constructor(private readonly wasteRequestService: WasteRequestService) {}

  // User creates a new request
  @Post()
  @Roles('user')
  createRequest(@Req() req, @Body() body) {
    console.log('Received waste request:', body);
    return this.wasteRequestService.createRequest(req.user.id, body);
  }

  @Get('user')
  @Roles('user')
  getUserRequests(@Req() req) {
    return this.wasteRequestService.getUserRequests(req.user.id);
  }

  // Get requests assigned to a company
  @Get('company')
  @Roles('company')
  async getCompanyRequests(@Req() req) {
    const companyId = req.user.id;
    return this.wasteRequestService.getCompanyRequestsByCompanyId(companyId);
  }

  // Accept a request
  @Patch('accept/:id')
  @Roles('company')
  async acceptRequest(@Param('id') id: string, @Req() req) {
    const requestId = Number(id);
    const company = req.user as Company;
    return this.wasteRequestService.acceptRequest(requestId, company);
  }

  @Patch('reject/:id')
  @Roles('company')
  rejectRequest(@Param('id') id: string, @Req() req, @Body() body) {
    const requestId = Number(id);
    const company = req.user as Company;
    return this.wasteRequestService.rejectRequest(
      requestId,
      company,
      body.reason,
    );
  }

  // Complete a request
  @Patch('complete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('company')
  completeRequest(@Param('id') id: string, @Req() req) {
    const requestId = Number(id);

    if (!req.user?.company?.id) {
      throw new ForbiddenException('Company context missing');
    }

    return this.wasteRequestService.completeRequest(
      requestId,
      req.user.company,
    );
  }

  @Get('company/dashboard')
  @Roles('company')
  getDashboard(@Req() req) {
    return this.wasteRequestService.getCompanyDashboard(req.user.id);
  }
}
