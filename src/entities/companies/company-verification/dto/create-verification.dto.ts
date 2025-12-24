// verification-request.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { Company } from '../../../../entities/companies/company/company.entity';

@Entity('verification_requests')
export class CreateVerificationDto {
  @Column('text', { array: true })
  documentUrls: string[];

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => Company, (company) => company.verificationRequests, { eager: true })
  company: Company; 
}
