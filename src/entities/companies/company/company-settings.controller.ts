import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanySettingsService } from './company-settings.service';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';
import { UpdateCompanySettingsDto } from './dto/update-settings.dto';
import { NotificationSettingsDto } from './dto/notification-settings.dto';

@Controller('company/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('company')
export class CompanySettingsController {
  constructor(private settingsService: CompanySettingsService) {}

  @Get()
  getSettings(@Req() req) {
    return this.settingsService.getSettings(req.user.id);
  }

  @Put()
  updateSettings(@Req() req, @Body() data: UpdateCompanySettingsDto) {
    return this.settingsService.updateSettings(req.user.id, data);
  }

  @Get('notifications')
  getNotificationSettings(@Req() req) {
    return this.settingsService.getNotificationSettings(req.user.id);
  }

  @Put('notifications')
  updateNotificationSettings(@Req() req, @Body() data: NotificationSettingsDto) {
    return this.settingsService.updateNotificationSettings(req.user.id, data);
  }
}