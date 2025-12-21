// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../entities/users/user/dto/create-user.dto';
import { LoginUserDto } from '../entities/users/user/dto/login-user.dto';
import {LoginAdminDto} from '../auth/dto/login-admin.dto';
import {RegisterAdminDto} from '../auth/dto/register-admin.dto';
import { UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { RequestResetDto } from '../dto/request.reset.dto';
import { ResetPasswordDto } from '../dto/reset.password.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // USER REGISTER
  @Post('user/register')
  registerUser(@Body() body: CreateUserDto) {
    return this.authService.registerUser(body);
  }

  // USER LOGIN
  @Post('user/login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60 } })
  loginUser(@Body() body: LoginUserDto) {
    return this.authService.loginUser(body);
  }

  // ADMIN REGISTER
  @Post('admin/register')
  registerAdmin(@Body() body: RegisterAdminDto) {
    return this.authService.registerAdmin(body);
  }

  // ADMIN LOGIN (VERY SENSITIVE)
  @Post('admin/login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60 } })
  loginAdmin(@Body() body: LoginAdminDto) {
    return this.authService.loginAdmin(body);
  }

  @Post('forgot-password')
async forgotPassword(@Body() dto: RequestResetDto) {
  return this.authService.requestPasswordReset(dto.email);
}

@Post('reset-password')
async resetPassword(@Body() dto: ResetPasswordDto) {
  return this.authService.resetPassword(dto.token, dto.newPassword);
}

}










