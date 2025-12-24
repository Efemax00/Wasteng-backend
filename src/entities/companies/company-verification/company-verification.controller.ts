import { Controller, Post, Patch, Get, Req, Body, UseGuards, UploadedFiles, UseInterceptors, BadRequestException, Param } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';
import { CompanyVerificationService } from '../../../entities/companies/company-verification/company-verification.service';
import { CreateVerificationDto } from '../../../entities/companies/company-verification/dto/create-verification.dto';
import { UpdateVerificationDto } from '../../../entities/companies/company-verification/dto/update-verification.dto';
import { CloudinaryService } from '../../../entities/users/user/cloudinary.service';

@Controller('company/verification')
export class CompanyVerificationController {
  constructor(
    private verificationService: CompanyVerificationService,
    private cloudinaryService: CloudinaryService,
  ) {}


 @Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('company')
@UseInterceptors(FilesInterceptor('documents'))
async submitVerification(@UploadedFiles() files: Express.Multer.File[], @Req() req) {
  if (!files || files.length === 0) throw new BadRequestException('No documents uploaded');

  // Upload all files to Cloudinary
  const uploadedUrls = await this.cloudinaryService.uploadFiles(files);

  const dto: CreateVerificationDto = {
    documentUrls: uploadedUrls,
    status: 'pending',
    company: { id: req.user.id } as any,
  };

  // Use req.user.id for the companyId
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
  const requests = await this.verificationService.getPendingRequests();
  return requests.map(req => ({
    id: req.id,
    companyName: req.company.companyName,
    registrationNumber: req.company.registrationNumber,
    yearEstablished: req.company.yearEstablished,
    numberOfEmployees: req.company.numberOfEmployees,
    operatingStates: req.company.operatingStates,
    licenseNumber: req.company.licenseNumber,
    status: req.status,
    documentUrls: Array.isArray(req.documentUrls) ? req.documentUrls : [],
    createdAt: req.createdAt,
    adminNotes: req.adminNotes,
  }));
}

  @Patch('requests/:id') 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateRequestStatus(@Param('id') id: number, @Body() dto: UpdateVerificationDto) {
    return this.verificationService.updateRequestStatus(id, dto);
  }
}
