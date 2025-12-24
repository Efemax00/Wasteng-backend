import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationRequest } from '../../../entities/companies/company-verification/entities/verification-request.entity';
import { Company } from '../../../entities/companies/company/company.entity';
import { CreateVerificationDto } from '../../../entities/companies/company-verification/dto/create-verification.dto';
import { UpdateVerificationDto } from '../../../entities/companies/company-verification/dto/update-verification.dto';

@Injectable()
export class CompanyVerificationService {
  getStatus(id: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(VerificationRequest)
    private verificationRepo: Repository<VerificationRequest>,
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
  ) {}

  async createRequest(companyId: number, createDto: CreateVerificationDto) {
    const company = await this.companyRepo.findOne({
      where: { id: companyId },
    });
    if (!company) throw new NotFoundException('Company not found');

    const requests = createDto.documentUrls.map((url: string) => {
      const request = new VerificationRequest();
      request.company = company;
      request.documentUrl = url;
      request.status = 'pending';
      return request;
    });

    return this.verificationRepo.save(requests);
  }

  // company-verification.service.ts
  async getPendingRequests() {
    return this.verificationRepo.find({
      where: { status: 'pending' },
      relations: ['company'], // This is what you were missing
      order: { createdAt: 'DESC' },
    });
  }

  async approveRequest(id: number) {
    const request = await this.verificationRepo.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!request) throw new NotFoundException('Request not found');

    request.status = 'approved';
    request.reviewedAt = new Date();

    request.company.isVerified = true;
    request.company.verificationStatus = 'approved';

    await this.companyRepo.save(request.company);
    return this.verificationRepo.save(request);
  }

  async rejectRequest(id: number, reason: string) {
    const request = await this.verificationRepo.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!request) throw new NotFoundException('Request not found');

    request.status = 'rejected';
    request.rejectionReason = reason;
    request.reviewedAt = new Date();

    request.company.verificationStatus = 'rejected';

    await this.companyRepo.save(request.company);
    return this.verificationRepo.save(request);
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
