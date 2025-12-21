import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationRequest } from '../../../entities/companies/company-verification/entities/verification-request.entity';
import { Company } from '../../../entities/companies/company/company.entity';
import { CreateVerificationDto } from '../../../entities/companies/company-verification/dto/create-verification.dto';
import { UpdateVerificationDto } from '../../../entities/companies/company-verification/dto/update-verification.dto';

@Injectable()
export class CompanyVerificationService {
  constructor(
    @InjectRepository(VerificationRequest)
    private verificationRepo: Repository<VerificationRequest>,
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
  ) {}

  async createRequest(companyId: number, createDto: CreateVerificationDto) {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const request = this.verificationRepo.create({
      company,
      documentUrl: createDto.documentUrl,
      status: 'pending',
    });

    return this.verificationRepo.save(request);
  }

  async getStatus(companyId: number) {
    return this.verificationRepo.findOne({
      where: { company: { id: companyId } },
      order: { createdAt: 'DESC' },
    });
  }

  // Admin functions
  async getPendingRequests() {
    return this.verificationRepo.find({
      where: { status: 'pending' },
      relations: ['company'],
    });
  }

  async updateRequestStatus(id: number, updateDto: UpdateVerificationDto) {
    const request = await this.verificationRepo.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!request) throw new NotFoundException('Request not found');

    request.status = updateDto.status;
    request.adminNotes = updateDto.adminNotes || null;

    if (updateDto.status === 'approved') {
      request.company.isVerified = true;
      await this.companyRepo.save(request.company);
    }

    return this.verificationRepo.save(request);
  }
}
