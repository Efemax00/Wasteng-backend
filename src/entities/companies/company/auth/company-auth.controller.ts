// src/company/auth/company-auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../../../../auth/auth.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { LoginCompanyDto } from '../dto/login-company.dto';

@Controller('company')
export class CompanyAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: CreateCompanyDto) {
    return this.authService.registerCompany(data);
  }

  
  @Post('login')
  async login(@Body() data: LoginCompanyDto) {
    return this.authService.loginCompany(data);
  }
}
