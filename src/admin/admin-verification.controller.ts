import { CompanyVerificationService } from '../entities/companies/company-verification/company-verification.service';
import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';



@Controller('admin/verifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminVerificationController {
  constructor(
    private readonly verificationService: CompanyVerificationService,
  ) {}

  @Get()
  getAllPending() {
    return this.verificationService.getPendingRequests();
  }

  @Patch(':id/approve')
  approve(@Param('id') id: number) {
    return this.verificationService.approveRequest(Number(id));
  }

  @Patch(':id/reject')
  reject(
    @Param('id') id: number,
    @Body('reason') reason: string,
  ) {
    return this.verificationService.rejectRequest(Number(id), reason);
  }
}
