import { Controller, Get, Patch, Body, Req, UseGuards } from "@nestjs/common";
import { UsersProfileService } from "../../../entities/users/profile/user-profile.service";
import { JwtAuthGuard } from "../../../auth/jwt-auth.guard";
import { RolesGuard } from "../../../auth/roles.guard";
import { Roles } from "../../../auth/roles.decorator";

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
export class UserProfileController {
  constructor(private profileService: UsersProfileService) {}

  @Get('profile')
  getProfile(@Req() req) {
    return this.profileService.getProfile(req.user);
  }

  @Patch('profile')
  updateProfile(@Req() req, @Body() body) {
    return this.profileService.updateProfile(req.user.id, body);
  }

  @Patch('password')
  updatePassword(@Req() req, @Body() body) {
    return this.profileService.changePassword(
      req.user.id,
      body.oldPassword,
      body.newPassword
    );
  }
}
