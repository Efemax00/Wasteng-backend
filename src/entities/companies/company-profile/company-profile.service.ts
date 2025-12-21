import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../../entities/companies/company/company.entity';
import { UpdateCompanyDto } from '../../../entities/companies/company/dto/update-company.dto';
import { ChangePasswordDto } from '../../../entities/companies/company/dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompanyProfileService {
  constructor(
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
  ) {}

  // Helper method to find company by ID (JWT ID)
  private async findById(id: number) {
    const company = await this.companyRepo.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  // GET COMPANY PROFILE
  async getProfile(id: number) {
    const company = await this.findById(id);
    const { password, ...profile } = company;
    return profile;
  }

  // UPDATE COMPANY PROFILE
  async updateCompanyProfile(id: number, data: UpdateCompanyDto) {
    const company = await this.findById(id);
    Object.assign(company, data);
    const updated = await this.companyRepo.save(company);
    const { password, ...profile } = updated;
    return profile;
  }

  // CHANGE PASSWORD
  async changePassword(id: number, oldPassword: string, newPassword: string) {
    const company = await this.findById(id);
    const passwordMatch = await bcrypt.compare(oldPassword, company.password);
    if (!passwordMatch) throw new BadRequestException('Old password is incorrect');

    company.password = await bcrypt.hash(newPassword, 10);
    await this.companyRepo.save(company);

    return { message: 'Password changed successfully' };
  }

  // UPDATE COMPANY LOGO
  async updateCompanyLogo(id: number, logoUrl: string) {
    const company = await this.findById(id);
    company.companyLogo = logoUrl;

    const updated = await this.companyRepo.save(company);
    const { password, ...profile } = updated;
    return profile;
  }
}
