import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  findByEmail(email: string) {
    return this.adminRepo.findOne({ where: { email } });
  }

  save(admin: Admin) {
    return this.adminRepo.save(admin);
  }

  create(adminData: Partial<Admin>) {
    const admin = this.adminRepo.create(adminData);
    return this.adminRepo.save(admin);
  }
}
