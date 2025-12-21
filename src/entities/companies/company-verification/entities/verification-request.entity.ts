import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../../../entities/companies/company/company.entity';

@Entity()
export class VerificationRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.id)
  company: Company;

  @Column()
  documentUrl: string; // URL of uploaded document

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ type: 'text', nullable: true })
  adminNotes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
