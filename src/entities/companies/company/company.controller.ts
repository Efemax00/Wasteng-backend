import {
  Controller,
  Get,
  Put,
  Patch,
  Post,
  Delete,
  Body,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';

import { CompanyProfileService } from '../company-profile/company-profile.service';
import { CompanyService } from '../company/company.service';

import { UpdateCompanyDto } from '../company/dto/update-company.dto';
import { ChangePasswordDto } from '../company/dto/change-password.dto';
import { DeleteCompanyDto } from '../company/dto/delete-company.dto';

import { CloudinaryService } from '../../../entities/users/user/cloudinary.service';

@Controller('company/profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('company')
export class CompanyController {
  constructor(
    private readonly profileService: CompanyProfileService,
    private readonly companyService: CompanyService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // 🔹 GET COMPANY PROFILE
  @Get()
  getProfile(@Req() req) {
    return this.profileService.getProfile(req.user.id);
  }

  // 🔹 UPDATE COMPANY PROFILE
  @Put('update')
  updateProfile(@Req() req, @Body() body: UpdateCompanyDto) {
    return this.profileService.updateCompanyProfile(req.user.id, body);
  }

  // 🔐 CHANGE PASSWORD
  @Patch('change-password')
  changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.companyService.changePassword(req.user.id, dto);
  }

  // 🔑 ENABLE 2FA
  @Post('enable-2fa')
  enable2FA(@Req() req) {
    return this.companyService.enable2FA(req.user.id);
  }

  // 🔑 DISABLE 2FA
  @Post('disable-2fa')
  disable2FA(@Req() req) {
    return this.companyService.disable2FA(req.user.id);
  }

  // ☠️ DELETE COMPANY (SOFT DELETE)
  @Delete()
  deleteCompany(@Req() req, @Body() dto: DeleteCompanyDto) {
    return this.companyService.deleteCompany(req.user.id, dto.password);
  }

  // 🖼️ UPLOAD / UPDATE LOGO
  @Patch('logo')
  @UseInterceptors(FileInterceptor('logo'))
  async uploadLogo(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const secureUrl = await this.cloudinary.uploadImage(file);
    return this.profileService.updateCompanyLogo(req.user.id, secureUrl);
  }
}
