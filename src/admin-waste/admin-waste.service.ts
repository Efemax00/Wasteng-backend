import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WasteRequest } from '../entities/waste-request/waste-request.entity';
import { Company } from '../entities/companies/company/company.entity';

@Injectable()
export class AdminWasteService {
  constructor(
    @InjectRepository(WasteRequest)
    private wasteRepo: Repository<WasteRequest>,

    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
  ) {}

  // 🔹 Get all waste requests
  async getAllRequests() {
    return this.wasteRepo.find({ relations: ['user', 'company'] });
  }

  // 🔹 Get requests by status
  async getRequestsByStatus(status: 'pending' | 'accepted' | 'rejected' | 'enroute' | 'completed') {
    return this.wasteRepo.find({ where: { status }, relations: ['user', 'company'] });
  }

  // 🔹 Assign a company to a pending request
  async assignCompany(requestId: number, companyId: number) {
    const request = await this.wasteRepo.findOne({ where: { id: requestId }, relations: ['company'] });
    if (!request) throw new NotFoundException('Request not found');

    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    request.company = company; // assign entity, not ID
    request.status = 'accepted';
    return this.wasteRepo.save(request);
  }

  // 🔹 Delete a waste request
  async deleteRequest(requestId: number) {
    const result = await this.wasteRepo.delete(requestId);
    if (result.affected === 0) throw new NotFoundException('Request not found');
    return { message: 'Deleted successfully' };
  }
}
