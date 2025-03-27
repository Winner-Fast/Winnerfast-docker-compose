import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import {User} from '../../user/entity/user'; 

@Entity('expense')
export class Expense {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text", nullable:false})
    operationName: string

    @Column({ type: 'enum', enum: ['fixed', 'variable'], nullable: false })
    type: 'fixed' | 'variable';

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    amount: number;

    @Column({ type: 'date', nullable: false })
    date: Date;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    category: string; 
    
    @Column({ nullable: false })
    userId: number;

    @ManyToOne(() => User, (user) => user.expenses,{
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'
    })

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
