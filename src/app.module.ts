import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './entities/users/user/users.module';
import { CompanyModule } from './entities/companies/company/company.module';
import { AdminModule } from './admin/admin.module';
import { ProfileModule } from './entities/users/profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { WasteRequestModule } from './entities/waste-request/waste-request.module';
import { CompanyProfileModule } from './entities/companies/company-profile/company-profile.module';
import { CompanyVerificationModule } from './entities/companies/company-verification/company-verification.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

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

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        
        // If DATABASE_URL exists, parse it
        if (databaseUrl && databaseUrl.startsWith('postgresql://')) {
          const url = new URL(databaseUrl);
          
          return {
            type: 'postgres',
            host: url.hostname,
            port: parseInt(url.port),
            username: url.username,
            password: url.password,
            database: url.pathname.slice(1),
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV !== 'production',
            logging: true,
            ssl: {
              rejectUnauthorized: false,
            },
          };
        }
        
        // Fallback to individual env vars
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST') || 'localhost',
          port: configService.get<number>('DB_PORT') || 5432,
          username: configService.get<string>('DB_USERNAME') || 'postgres',
          password: configService.get<string>('DB_PASSWORD') || 'EfEpounds9090lkp',
          database: configService.get<string>('DB_NAME') || 'wasteDB',
          autoLoadEntities: true,
          synchronize: true,
          logging: true,
        };
      },
      inject: [ConfigService],
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