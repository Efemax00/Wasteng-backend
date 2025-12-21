import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './entities/users/user/users.module';
import { CompanyModule } from './entities/companies/company/company.module';
import { AdminModule } from './admin/admin.module';
import { ProfileModule } from './entities/users/profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { WasteRequestModule } from './entities/waste-request/waste-request.module';
import { CompanyProfileModule } from './entities/companies/company-profile/company-profile.module';
import { CompanyVerificationModule } from './entities/companies/company-verification/company-verification.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_URL,
      port: 5432, // your actual port
      username: 'postgres',
      password: 'EfEpounds9090lkp', // replace with your real pg password
      database: 'wasteDB',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    CompanyModule,
    AdminModule,
    ProfileModule,
    WasteRequestModule,
    AuthModule,
    CompanyProfileModule,
    CompanyVerificationModule,
  ],
})
export class AppModule {}
