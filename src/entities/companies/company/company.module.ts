import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from '../company/company.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryService } from '../../../entities/users/user/cloudinary.service';
import { CompanyProfileModule } from '../company-profile/company-profile.module';
import { CompanySettingsController } from './company-settings.controller';
import { CompanySettingsService } from './company-settings.service';
import { CompanyAuthController } from "../company/auth/company-auth.controller";
import {AuthModule} from '../../../auth/auth.module'; 


@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    // Add MulterModule for file uploads
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!allowedMimes.includes(file.mimetype)) {
          return cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'), false);
        }
        cb(null, true);
      },
    }),
    CompanyProfileModule,
  ],
  controllers: [CompanyController, CompanyAuthController, CompanySettingsController],
  providers: [CompanyService, CloudinaryService, CompanySettingsService],
  exports: [CompanyService, CompanySettingsService],
})
export class CompanyModule {}
