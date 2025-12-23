import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PrivacySettings, User, WastePreferences } from '../../../entities/users/user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  findAll() {
    throw new Error('Method not implemented.');
  }
  async save(user: User): Promise<User> {
  return this.usersRepository.save(user);
}
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // =============================
  //  CREATE USER
  // =============================
  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  // =============================
  //  FIND USER
  // =============================
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // =============================
  //  UPDATE GENERAL USER FIELDS
  // =============================
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, data);
    const updatedUser = await this.usersRepository.findOne({ where: { id } });

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    return updatedUser;
  }

  // =============================
  //  UPDATE AVATAR
  // =============================
  async updateAvatar(userId: number, avatarUrl: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.avatar = avatarUrl;
    return this.usersRepository.save(user);
  }

  // =============================
  //  CHANGE PASSWORD
  // =============================
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const passwordMatches = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatches) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    return this.usersRepository.save(user);
  }

  // =============================
  //  UPDATE PRIVACY SETTINGS
  // =============================
  async updatePrivacySettings(userId: number, privacySettings: PrivacySettings): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.privacySettings = privacySettings;
    return this.usersRepository.save(user);
  }

  // =============================
  //  UPDATE WASTE PREFERENCES
  // =============================
  async updateWastePreferences(userId: number, wastePreferences: WastePreferences): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.wastePreferences = wastePreferences;
    return this.usersRepository.save(user);
  }
}






