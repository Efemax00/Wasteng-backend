import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { WasteRequest } from './waste-request.entity';
import { Company } from '../companies/company/company.entity';
import { WasteRequestRejection } from './waste-request-rejection.entity';
import { CompanyVerificationStatus } from '../companies/company/company.entity';

@Injectable()
export class WasteRequestService {
  constructor(
    @InjectRepository(WasteRequest)
    private wasteRequestRepo: Repository<WasteRequest>,
    @InjectRepository(WasteRequestRejection)
    private rejectionRepo: Repository<WasteRequestRejection>, 
  ) {}

  // Create a new request
  async createRequest(userId: number, data: Partial<WasteRequest>) {
    const request = this.wasteRequestRepo.create({
      ...data,
      user: { id: userId }, // Create relation by ID
    });

    const saved = await this.wasteRequestRepo.save(request);
    console.log('Created waste request:', saved.id, 'for user:', userId);

    return saved;
  }

  // ✅ FIXED: Accept userId (number) instead of User object
  async getUserRequests(userId: number) {
    return this.wasteRequestRepo.find({
      where: {
        user: { id: userId }, // Filter by user ID
      },
      relations: ['company'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get all requests for a company
  async getCompanyRequestsByCompanyId(companyId: number) {
    return this.wasteRequestRepo.find({
      where: [
        { company: IsNull(), status: 'pending' },
        { company: { id: companyId } },
      ],
      relations: ['user', 'company'],
    });
  }

  // Accept request (company)
  async acceptRequest(requestId: number, company: Company) {
    if (company.verificationStatus !== CompanyVerificationStatus.VERIFIED) {
  throw new ForbiddenException('Company not verified');
}

    const request = await this.wasteRequestRepo.findOne({
      where: { id: requestId },
      relations: ['user', 'company'],
    });
    if (!request) throw new NotFoundException('Request not found');

     // ✅ Check if already accepted by another company
    if (request.company && request.status === 'accepted') {
      throw new NotFoundException(
        'This request has already been accepted by another company',
      );
    }
    request.status = 'accepted';
    request.company = company;
    return this.wasteRequestRepo.save(request);
  }

  // Decline request
  async rejectRequest(requestId: number, company: Company, reason: string) {
    const request = await this.wasteRequestRepo.findOne({
      where: { id: requestId },
      relations: ['user', 'company'],
    });
    if (!request) throw new NotFoundException('Request not found');

    const existingRejection = await this.rejectionRepo.findOne({
      where: {
        request: { id: requestId },
        company: { id: company.id },
      },
    });
    
    if (existingRejection) {
      throw new BadRequestException('You already rejected this request');
    }

    // ✅ Log the rejection
    await this.rejectionRepo.save({
      request,
      company,
      reason,
    });

    // ✅ Request stays pending for other companies
    return { 
      message: 'Request rejected. It will no longer appear in your list.',
      requestId: request.id
    };
  }


  // Complete request
  async completeRequest(requestId: number) {
    const request = await this.wasteRequestRepo.findOne({
      where: { id: requestId },
      relations: ['user', 'company'],
    });
    if (!request) throw new NotFoundException('Request not found');

    request.status = 'completed';
    return this.wasteRequestRepo.save(request);
  }

  // Get company dashboard stats
  async getCompanyDashboard(companyId: number) {
    const requests = await this.wasteRequestRepo.find({
      where: { company: { id: companyId } },
    });

    let plastic = 0;
    let organic = 0;
    let metal = 0;

    for (const r of requests) {
      if (r.status !== 'completed') continue;

      if (r.wasteType === 'Plastic') plastic += 1;
      if (r.wasteType === 'Organic') organic += 1;
      if (r.wasteType === 'Metal') metal += 1;
    }

    return {
      plastic,
      organic,
      metal,
      total: plastic + organic + metal,
      pending: requests.filter((r) => r.status === 'pending').length,
      approved: requests.filter((r) => r.status === 'accepted').length,
      completed: requests.filter((r) => r.status === 'completed').length,
      timestamp: Date.now(),
    };
  }
}
