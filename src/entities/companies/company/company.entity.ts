import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { WasteRequest } from '../../../entities/waste-request/waste-request.entity';
import { VerificationRequest } from '../company-verification/entities/verification-request.entity';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;
  
  @OneToMany(
  () => VerificationRequest,
  (verification) => verification.company,
)
verificationRequests: VerificationRequest[];


  toSafeObject() {
    const { password, ...safe } = this;
    return safe;
  }

  @Column()
  companyName: string;

  @Column({ nullable: true })
  companyLogo: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  taxId: string;

  @Column({ type: 'integer', nullable: true })
  yearEstablished: number;

  @Column({ nullable: true })
  numberOfEmployees: number;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ nullable: true })
  licenseExpiry?: string;

  @Column({ nullable: true })
  operatingStates: string;

  @Column({ nullable: true })
  operatingHours: string;

  @Column({ nullable: true })
  workingDays: string;

  @Column({ nullable: true })
  serviceRadius: string;

  @Column({ nullable: true })
  responseTime: string;

  @Column({ nullable: true })
  minCollection: string;

  @Column({ nullable: true })
  vehicleFleet: string;

  @Column({ type: 'jsonb', nullable: true })
  notificationSettings: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  primaryContact: {
    fullName: string;
    position: string;
    email: string;
    phone: string;
  };

 @Column({ default: 'unverified' })
verificationStatus: 'unverified' | 'pending' | 'approved' | 'rejected';


  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
    select: false,
  })
  twoFactorSecret: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockUntil: Date | null;

  @Column({ type: 'varchar', nullable: true })
  passwordResetToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires: Date | null;

  @OneToMany(() => WasteRequest, (wasteRequest) => wasteRequest.company)
  wasteRequests: WasteRequest[];
}
