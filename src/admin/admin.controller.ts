import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from '../entities/users/user/users.service';
import { CompanyService } from '../entities/companies/company/company.service';
import { AdminService } from '../admin/admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly companyService: CompanyService,
    private readonly adminService: AdminService,
  ) {}

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

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('companies')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllCompanies() {
    return this.companyService.findAll();
  }

  @Get('dashboard/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getDashboardStats() {
    return this.adminService.getStats();
  }
}
