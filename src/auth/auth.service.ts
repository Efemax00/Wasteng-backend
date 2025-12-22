import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../entities/users/user/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/companies/company/company.entity';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { CreateCompanyDto } from '../entities/companies/company/dto/create-company.dto';
import { isAccountLocked } from '../auth/auth.utils';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  adminsService: any;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async registerCompany(data: CreateCompanyDto) {
    const existing = await this.companyRepo.findOne({
      where: { email: data.email },
    });

    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const companyData: any = {
      ...data,
      password: hashedPassword,
      yearEstablished: data.yearEstablished
        ? Number(data.yearEstablished)
        : undefined,
      numberOfEmployees: data.numberOfEmployees
        ? Number(data.numberOfEmployees)
        : undefined,
      primaryContact: data.primaryContact,
    };

    const saved = await this.companyRepo.save(companyData);

    // ✅ Remove password before returning
    const { password, ...safeCompany } = saved as any;

    return {
      message: 'Company registered successfully',
      company: safeCompany,
    };
  }

  async loginCompany(data: { email: string; password: string }) {
    const company = await this.companyRepo.findOne({
      where: { email: data.email },
      select: [
        'id',
        'email',
        'password',
        'companyName',
        'companyLogo',
        'failedLoginAttempts',
        'lockUntil',
      ],
    });

    if (!company) throw new UnauthorizedException('Invalid email or password');

    if (isAccountLocked(company)) {
      throw new UnauthorizedException(
        'Account locked due to multiple failed login attempts. Try again later.',
      );
    }

    const isMatch = await bcrypt.compare(data.password, company.password);

    if (!isMatch) {
      company.failedLoginAttempts = (company.failedLoginAttempts || 0) + 1;

      if (company.failedLoginAttempts >= 5) {
        company.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // lock 15 mins
      }

      await this.companyRepo.save(company);

      const attemptsLeft = Math.max(0, 5 - company.failedLoginAttempts);

      throw new UnauthorizedException(
        `Invalid email or password. You have ${attemptsLeft} attempt(s) left.`,
      );
    }

    company.failedLoginAttempts = 0;
    company.lockUntil = null;
    await this.companyRepo.save(company);

    const token = this.jwtService.sign({ id: company.id, role: 'company' });

    return {
      message: 'Login successful',
      token,
      company: {
        id: company.id,
        email: company.email,
        companyName: company.companyName,
        companyLogo: company.companyLogo,
      },
    };
  }

  // ==============================
  // USER AUTH
  // ==============================

  async registerUser(data: { email: string; password: string; name: string }) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.usersService.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: 'user',
    });

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async loginUser(data: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user || user.role !== 'user') {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (isAccountLocked(user)) {
      throw new UnauthorizedException(
        'Account locked due to multiple failed login attempts. Try again later.',
      );
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // lock 15 mins
      }

      await this.usersService.save(user);

      const attemptsLeft = Math.max(0, 5 - user.failedLoginAttempts);

      throw new UnauthorizedException(
        `Invalid email or password. You have ${attemptsLeft} attempt(s) left.`,
      );
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await this.usersService.save(user);

    const token = this.jwtService.sign({ id: user.id, role: 'user' });

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  // ==============================
  // ADMIN AUTH
  // ==============================

  async registerAdmin(data: RegisterAdminDto) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const admin = await this.usersService.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: 'admin',
    });

    return {
      message: 'Admin registered successfully',
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  async loginAdmin(data: { email: string; password: string }) {
  const admin = await this.usersService.findByEmail(data.email);

  if (!admin || admin.role !== 'admin') {
    throw new UnauthorizedException('Invalid email or password');
  }

  if (isAccountLocked(admin)) {
    throw new UnauthorizedException(
      'Account locked due to multiple failed login attempts. Try again later.',
    );
  }

  const isMatch = await bcrypt.compare(data.password, admin.password);

  if (!isMatch) {
    admin.failedLoginAttempts = (admin.failedLoginAttempts || 0) + 1;

    if (admin.failedLoginAttempts >= 5) {
      admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
    }

    await this.usersService.save(admin);

    const attemptsLeft = Math.max(0, 5 - admin.failedLoginAttempts);

    throw new UnauthorizedException(
      `Invalid email or password. You have ${attemptsLeft} attempt(s) left.`,
    );
  }

  admin.failedLoginAttempts = 0;
  admin.lockUntil = null;
  await this.usersService.save(admin);

  const token = this.jwtService.sign({
    id: admin.id,
    role: 'admin',
  });

  return {
    message: 'Login successful',
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
  };
}


  async requestPasswordReset(email: string) {
  const company = await this.companyRepo.findOne({ where: { email } });
  if (!company) {
    throw new BadRequestException("Email not found");
  }

  // Generate a secure token
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  company.passwordResetToken = token;
  company.passwordResetExpires = expires;

  await this.companyRepo.save(company);

  // Send the token via email (stub for now)
  console.log(`Password reset link: http://localhost:3000/reset-password?token=${token}`);

  return { message: "Password reset link sent to your email" };
}

async resetPassword(token: string, newPassword: string) {
  const company = await this.companyRepo.findOne({
    where: { passwordResetToken: token },
  });

  if (!company) {
    throw new BadRequestException("Invalid token");
  }

  if (!company.passwordResetExpires || company.passwordResetExpires < new Date()) {
  throw new BadRequestException("Token has expired");
}

  company.password = await bcrypt.hash(newPassword, 10);
  company.passwordResetToken = null;
  company.passwordResetExpires = null;

  await this.companyRepo.save(company);

  return { message: "Password reset successfully" };
}

}
