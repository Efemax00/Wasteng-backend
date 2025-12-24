import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../../../entities/companies/company/company.entity';

@Entity('verification_requests')
export class VerificationRequest {
  @PrimaryGeneratedColumn()
  id: number;

  // Link to company
  @ManyToOne(() => Company, (company) => company.verificationRequests, {
    eager: true,
    onDelete: 'CASCADE',
  })
  company: Company;

  @Column('jsonb', { default: [] })
  documentUrls: {
    name: string;
    url: string;
    status: string;
    uploadedAt: string;
  }[];

  //  Status of verification
  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  //  Reason shown to company if rejected
  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null;

  //  Optional admin internal note
  @Column({ type: 'text', nullable: true })
  adminNotes: string | null;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  documentUrl: string;
}
