import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { WasteRequest } from '../../../entities/waste-request/waste-request.entity';

export type UserRole = 'user' | 'company' | 'admin';

// Privacy Settings Type
export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'companies-only';
  showEmail: boolean;
  showPhone: boolean;
}

// Waste Preferences Type
export interface WastePreferences {
  notifyNewCompanies: boolean;
  notifyPriceChanges: boolean;
  preferredCategories: string[];
  autoAcceptOffers: boolean;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockUntil: Date | null;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'user',
  })
  role: UserRole;

  // Privacy Settings
  @Column({
    type: 'json',
    nullable: true,
    default: () =>
      '\'{"profileVisibility":"public","showEmail":false,"showPhone":false}\'',
  })
  privacySettings: PrivacySettings;

  // Waste Preferences
  @Column({
    type: 'json',
    nullable: true,
    default: () =>
      '\'{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}\'',
  })
  wastePreferences: WastePreferences;

  @OneToMany(() => WasteRequest, (request) => request.user)
  wasteRequests: WasteRequest[];
}
