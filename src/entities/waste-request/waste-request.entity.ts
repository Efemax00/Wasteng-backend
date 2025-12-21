// waste-request.entity.ts
import { Company } from '../companies/company/company.entity';
import { User } from '../users/user/user.entity';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn,
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

@Entity('waste_requests')
export class WasteRequest {
  @PrimaryGeneratedColumn()
  id: number;

  // Remove the bidirectional reference for now
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Remove the bidirectional reference for now
  @ManyToOne(() => Company, { eager: true, nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  wasteType: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'date' })
  preferredDate: Date;

  @Column({ 
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected', 'enroute', 'completed'],
    default: 'pending' 
  })
  status: 'pending' | 'accepted' | 'rejected' | 'enroute' | 'completed';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  declinedReason: string;
  rejectedReason: string;
  quantity: number;

  // REMOVED: This was wrong - WasteRequest should not have a relation to itself
  // @OneToMany(() => WasteRequest, (wasteRequest) => wasteRequest.company)
  // wasteRequests: WasteRequest[];
}



