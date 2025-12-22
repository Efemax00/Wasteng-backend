import { Controller, Post, Patch, Get, Req, Body, UseGuards, UploadedFiles, UseInterceptors, BadRequestException, Param } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';
import { CompanyVerificationService } from '../../../entities/companies/company-verification/company-verification.service';
import { CreateVerificationDto } from '../../../entities/companies/company-verification/dto/create-verification.dto';
import { UpdateVerificationDto } from '../../../entities/companies/company-verification/dto/update-verification.dto';

@Controller('company/verification')
export class CompanyVerificationController {
  constructor(private verificationService: CompanyVerificationService) {}

  @Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('company')
@UseInterceptors(FilesInterceptor('documents', 5)) // max 5 files
async submitVerification(@UploadedFiles() files: Express.Multer.File[], @Req() req) {
  if (!files || files.length === 0) {
    throw new BadRequestException('No documents uploaded');
  }

  const dto: CreateVerificationDto = {
    documentUrls: files.map(file => file.path), // or file.url if using Cloudinary
  };

  return this.verificationService.createRequest(req.user.id, dto);
}

  @Get('status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('company')
  async getStatus(@Req() req) {
    return this.verificationService.getStatus(req.user.id);
  }

  // Admin routes
  @Get('requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getPendingRequests() {
    return this.verificationService.getPendingRequests();
  }

  @Patch('requests/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateRequestStatus(@Param('id') id: number, @Body() dto: UpdateVerificationDto) {
    return this.verificationService.updateRequestStatus(id, dto);
  }
}
