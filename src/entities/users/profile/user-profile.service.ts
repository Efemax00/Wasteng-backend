import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../entities/users/user/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersProfileService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // 🔹 Fetch user profile
  async getProfile(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });

    if (!user || user.role !== 'user') {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // 🔹 Update user profile (NON-company fields)
  async updateProfile(userId: number, data: Partial<User>) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });

    if (!user || user.role !== 'user') {
      throw new NotFoundException('User not found');
    }

    // 🚫 Prevent company fields from being touched
    delete (data as any).companyName;
    delete (data as any).companyRegNumber;
    delete (data as any).companyLogo;
    delete (data as any).companyDescription;
    delete (data as any).industry;

    Object.assign(user, data);
    return this.usersRepo.save(user);
  }

  // 🔹 Change password (user only)
  async changePassword(
    userId: number,
    oldPass: string,
    newPass: string,
  ) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });

    if (!user || user.role !== 'user') {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password incorrect');
    }

    user.password = await bcrypt.hash(newPass, 10);
    return this.usersRepo.save(user);
  }
}

