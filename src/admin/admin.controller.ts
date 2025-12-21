// src/admin/admin.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
export class AdminController {
  // Only admins can access these routes
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('dashboard')
  getDashboard(@Req() req) {
    return {
      message: 'Welcome Admin',
      adminId: req.user.id,
      role: req.user.role,
    };
  }
}
