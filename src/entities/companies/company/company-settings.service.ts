import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../../entities/companies/company/company.entity';
import { UpdateCompanySettingsDto } from '../../../entities/companies/company/dto/update-settings.dto';
import { NotificationSettingsDto } from '../../../entities/companies/company/dto/notification-settings.dto';

@Injectable()
export class CompanySettingsService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  // Get all company settings except password
  async getSettings(companyId: number) {
    const company = await this.companyRepo.findOneBy({ id: companyId });
    if (!company) throw new NotFoundException('Company not found');

    const { password, ...settings } = company;
    return settings;
  }

  // Update company settings
  async updateSettings(companyId: number, data: UpdateCompanySettingsDto) {
    const company = await this.companyRepo.findOneBy({ id: companyId });
    if (!company) throw new NotFoundException('Company not found');

    Object.assign(company, data);
    const updated = await this.companyRepo.save(company);

    const { password, ...settings } = updated;
    return settings;
  }

  // Update notification settings
  async updateNotificationSettings(
    companyId: number,
    data: NotificationSettingsDto,
  ) {
    const company = await this.companyRepo.findOneBy({ id: companyId });
    if (!company) throw new NotFoundException('Company not found');

    // Store as JSON (assuming the column type is json/jsonb)
    company.notificationSettings = data;
    await this.companyRepo.save(company);

    return data;
  }

  // Get notification settings with defaults
  async getNotificationSettings(companyId: number) {
    const company = await this.companyRepo.findOneBy({ id: companyId });
    if (!company) throw new NotFoundException('Company not found');

    return company.notificationSettings ?? {
      emailNotifications: true,
      smsNotifications: true,
      newRequests: true,
      statusUpdates: true,
      weeklyReports: true,
      systemAlerts: true,
    };
  }
}
