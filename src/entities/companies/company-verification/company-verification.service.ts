import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationRequest } from '../../../entities/companies/company-verification/entities/verification-request.entity';
import { Company } from '../../../entities/companies/company/company.entity';
import { CompanyVerificationStatus } from '../../../entities/companies/company/company.entity';
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

  /* ============================
     SUBMIT VERIFICATION (COMPANY)
     ============================ */
  async submitVerification(
    companyId: number,
    createDto: CreateVerificationDto,
  ) {
    const company = await this.companyRepo.findOne({
      where: { id: companyId },
      relations: ['verificationRequests'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // ❌ already pending
    if (company.verificationStatus === 'pending') {
      throw new BadRequestException(
        'Verification already submitted and under review',
      );
    }

    // ❌ already verified
    if (company.verificationStatus === 'verified') {
      throw new BadRequestException('Company already verified');
    }

    // create ONE request with ALL documents
    const request = this.verificationRepo.create({
      company,
      status: 'pending',
      documentUrls: createDto.documentUrls.map((url) => ({
        name: url.split('/').pop() || 'document',
        url,
        status: 'pending',
        uploadedAt: new Date().toISOString(),
      })),
    });

    await this.verificationRepo.save(request);

    // update company state
    company.verificationStatus = CompanyVerificationStatus.PENDING;
    await this.companyRepo.save(company);

    return request;
  }

  /* ============================
     ADMIN: FETCH PENDING
     ============================ */
  async getPendingRequests() {
    return this.verificationRepo.find({
      where: { status: 'pending' },
      relations: ['company'],
      order: { createdAt: 'DESC' },
    });
  }

  /* ============================
     ADMIN: APPROVE
     ============================ */
  async approveRequest(id: number) {
    const request = await this.verificationRepo.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!request) throw new NotFoundException('Request not found');

    request.status = 'approved';
    request.reviewedAt = new Date();

    request.company.verificationStatus = CompanyVerificationStatus.VERIFIED;

    await this.companyRepo.save(request.company);
    return this.verificationRepo.save(request);
  }

  /* ============================
     ADMIN: REJECT
     ============================ */
  async rejectRequest(id: number, reason: string) {
    const request = await this.verificationRepo.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!request) throw new NotFoundException('Request not found');

    request.status = 'rejected';
    request.rejectionReason = reason;
    request.reviewedAt = new Date();

    request.company.verificationStatus = CompanyVerificationStatus.REJECTED;

    await this.companyRepo.save(request.company);
    return this.verificationRepo.save(request);
  }

  /* ============================
     COMPANY: CHECK STATUS
     ============================ */
  async getStatus(companyId: number) {
    const company = await this.companyRepo.findOne({
      where: { id: companyId },
      select: ['verificationStatus'],
    });

    if (!company) throw new NotFoundException('Company not found');

    return company.verificationStatus;
  }
}

