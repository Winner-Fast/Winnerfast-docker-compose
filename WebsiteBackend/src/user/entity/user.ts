import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Expense } from '../../expenses/entities/expense.entity';
import { Product } from '../../product/entities/product.entity';
import { Sell } from '../../sell/entities/sell.entity';
@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 10 ,nullable: false })
    firstName: string;

    @Column({ length:10 ,nullable: false })
    lastName: string;
  
    @Column({ unique: true ,nullable: false })
    email: string;

    @Column({nullable: false})
    password: string;

    @Column({ type: 'enum', enum: ['admin','user'], default: 'user'})
    role: string;

    @Column({type: 'enum', enum: ['verified', 'unverified'], default: 'verified'})
    status: string;

    @Column({ nullable: true })
    otp: string;

    @OneToMany(() => Expense, (expense) => expense?.userId)
    expenses: Expense[];

    @OneToMany(()=> Product, (product) => product?.userId)
    products:Product[]

    @OneToMany(()=> Sell, (sell)=>sell?.userId)
    sells:Sell[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
