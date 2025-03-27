import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('supplier')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'text', nullable:false })
  name: string;

  @Column({nullable:false })
  phoneNumber: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'enum', enum: ['satisfied','Not satisfied', 'the best', 'Medium', 'first experience'], default: 'satisfied'})
  qualityService: string;

  @Column({ type: 'enum', enum: ['same day','1 day', '2 days', '3 days','4 days', '1 week', 'more than 1 week'], default: 'same day'})
  deliveryTime: string;

  @Column({ type: 'int', default: 0, nullable:false })
  totalOrders: number;

  @Column({ type: 'date', nullable: true })
  lastOrderDate: Date;
}