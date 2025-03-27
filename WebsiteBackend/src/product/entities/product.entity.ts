import { Sell } from "../../sell/entities/sell.entity";
import { User } from "../../user/entity/user";
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('product')
export class Product{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type: "text", nullable:false})
    name:string

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price:number

    @Column({ type: 'integer', nullable: false })
    stock:number

    @Column({type: "text", nullable:true})
    image: string;

    @ManyToOne(()=> User, (user)=>user.products,{
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    })
    @Column({ nullable: false })
    userId: number;

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updateAT:Date

    @ManyToMany(() => Sell, (sell) => sell.products,{onDelete: "CASCADE",onUpdate: "CASCADE"})
    sells?: Sell[];
}