import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, JoinColumn } from 'typeorm';
import { WasteRequest } from './waste-request.entity';
import { Company } from '../companies/company/company.entity';

@Entity('waste_request_rejections')
export class WasteRequestRejection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WasteRequest)
  @JoinColumn({ name: 'request_id' })
  request: WasteRequest;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ nullable: true })
  reason: string;

  @CreateDateColumn()
  rejectedAt: Date;
}