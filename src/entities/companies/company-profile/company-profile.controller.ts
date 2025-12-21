import {
  Controller,
  Get,
  Put,
  Patch,
  Body,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CompanyProfileService } from "./company-profile.service";
import { JwtAuthGuard } from "../../../auth/jwt-auth.guard";
import { RolesGuard } from "../../../auth/roles.guard";
import { Roles } from "../../../auth/roles.decorator";
import { UpdateCompanyDto } from "../../../entities/companies/company/dto/update-company.dto";
import { ChangePasswordDto } from "../../../entities/companies/company/dto/change-password.dto";
import { CloudinaryService } from '../../../entities/users/user/cloudinary.service';

@Controller("company/profile")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("company")
export class CompanyProfileController {
  constructor(
    private profileService: CompanyProfileService,
    private cloudinary: CloudinaryService // inject CloudinaryService
  ) {}

  // GET COMPANY PROFILE
  @Get()
  getProfile(@Req() req) {
    return this.profileService.getProfile(req.user.id);
  }

  // ------------------------------
  // UPDATE COMPANY PROFILE DETAILS
  // ------------------------------
  @Put("update")
  updateProfile(@Req() req, @Body() body: UpdateCompanyDto) {
    return this.profileService.updateCompanyProfile(req.user.id, body);
  }

  // ------------------------------
  // CHANGE PASSWORD
  // ------------------------------
  @Patch("password")
  changePassword(@Req() req, @Body() data: ChangePasswordDto) {
    return this.profileService.changePassword(
      req.user.id,
      data.oldPassword,
      data.newPassword
    );
  }

  // ------------------------------
  // UPLOAD / UPDATE LOGO
  // ------------------------------
  @Patch("logo")
  @UseInterceptors(FileInterceptor("logo"))
  async uploadLogo(
    @UploadedFile() file: Express.Multer.File,
    @Req() req
  ) {
    // Upload to Cloudinary
    const secureUrl = await this.cloudinary.uploadImage(file);

    // Update company entity
    return this.profileService.updateCompanyLogo(req.user.id, secureUrl);
  }
}



