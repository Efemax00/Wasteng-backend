import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';

import { UsersService } from '../../../entities/users/user/users.service';
import { CloudinaryService } from '../../../entities/users/user/cloudinary.service';
import * as userEntity from '../../../entities/users/user/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('profile')
  @Roles('user')
  async getProfile(@Req() req) {
    const user = await this.usersService.findById(req.user.id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  @Post('avatar')
  @Roles('user')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowed.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Only PNG, JPG, JPEG allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    const user = await this.usersService.findById(req.user.id);
    if (!user) throw new BadRequestException('User not found');

    if (user.avatar?.includes('cloudinary')) {
      await this.cloudinaryService.deleteImage(user.avatar);
    }

    const avatarUrl = await this.cloudinaryService.uploadImage(file);
    const updatedUser = await this.usersService.updateAvatar(
      req.user.id,
      avatarUrl,
    );

    return {
      avatarUrl: updatedUser.avatar,
      message: 'Avatar updated successfully',
    };
  }

  @Put('profile')
  @Roles('user')
  async updateProfile(@Req() req, @Body() body: Partial<userEntity.User>) {
    const { password, role, id, ...safeData } = body as any;
    const updatedUser = await this.usersService.updateUser(
      req.user.id,
      safeData,
    );

    const { password: _, ...safeUser } = updatedUser;
    return safeUser;
  }

  @Put('password')
  @Roles('user')
  async changePassword(
    @Req() req,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    if (!body.currentPassword || !body.newPassword) {
      throw new BadRequestException('Passwords required');
    }

    await this.usersService.changePassword(
      req.user.id,
      body.currentPassword,
      body.newPassword,
    );

    return { message: 'Password updated successfully' };
  }

  @Put('privacy')
  @Roles('user')
  async updatePrivacySettings(
    @Req() req,
    @Body() privacySettings: userEntity.PrivacySettings,
  ) {
    const user = await this.usersService.updatePrivacySettings(
      req.user.id,
      privacySettings,
    );

    return {
      message: 'Privacy settings updated',
      privacySettings: user.privacySettings,
    };
  }

  @Put('waste-preferences')
  @Roles('user')
  async updateWastePreferences(
    @Req() req,
    @Body() wastePreferences: userEntity.WastePreferences,
  ) {
    const user = await this.usersService.updateWastePreferences(
      req.user.id,
      wastePreferences,
    );

    return {
      message: 'Waste preferences updated',
      wastePreferences: user.wastePreferences,
    };
  }
}

