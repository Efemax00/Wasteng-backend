import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { Company } from '../../../entities/companies/company/company.entity';
import { UpdateCompanyDto } from '../../../entities/companies/company/dto/update-company.dto';
import { ChangePasswordDto } from '../../../entities/companies/company/dto/change-password.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  // 🔹 GET COMPANY PROFILE
  async getProfile(companyId: number) {
    const company = await this.companyRepo.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const { password, ...safeCompany } = company;
    return safeCompany;
  }

  // 🔹 UPDATE COMPANY PROFILE
  async updateCompanyProfile(
    companyId: number,
    data: UpdateCompanyDto,
  ) {
    const company = await this.companyRepo.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    Object.assign(company, data);

    const updated = await this.companyRepo.save(company);
    const { password, ...safeCompany } = updated;

    return safeCompany;
  }

  // 🔐 CHANGE COMPANY PASSWORD
  async changePassword(companyId: number, dto: ChangePasswordDto) {
    const company = await this.companyRepo.findOne({
      where: { id: companyId },
      select: ['id', 'password'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const match = await bcrypt.compare(dto.oldPassword, company.password);
    if (!match) {
      throw new BadRequestException('Old password is incorrect');
    }

    company.password = await bcrypt.hash(dto.newPassword, 10);
    await this.companyRepo.save(company);

    return { message: 'Password updated successfully' };
  }

  // 🔑 ENABLE 2FA
  async enable2FA(companyId: number) {
    await this.companyRepo.update(companyId, {
      twoFactorEnabled: true,
    });

    return { message: 'Two-factor authentication enabled' };
  }

  // 🔑 DISABLE 2FA
  async disable2FA(companyId: number) {
    await this.companyRepo.update(companyId, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    });

    return { message: 'Two-factor authentication disabled' };
  }

  // ☠️ DELETE COMPANY (SOFT DELETE)
  async deleteCompany(companyId: number, password: string) {
    const company = await this.companyRepo.findOne({
      where: { id: companyId },
      select: ['id', 'password'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const match = await bcrypt.compare(password, company.password);
    if (!match) {
      throw new BadRequestException('Incorrect password');
    }

    await this.companyRepo.softDelete(companyId);

    return { message: 'Company account deleted' };
  }

  // 🖼️ UPDATE COMPANY LOGO
  async updateCompanyLogo(companyId: number, logoUrl: string) {
    const company = await this.companyRepo.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    company.companyLogo = logoUrl;

    const updated = await this.companyRepo.save(company);
    const { password, ...safeCompany } = updated;

    return safeCompany;
  }
}

