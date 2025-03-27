import { Product } from "../../product/entities/product.entity";
import { User } from "../../user/entity/user";
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"; 
@Entity("sell")
export class Sell{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:"text", nullable:false})
    operationName: string

    @Column({type: "decimal", precision: 10, scale: 2, nullable: false})
    totalAmount:number

    @Column({type:"integer", nullable:false})
    quantity:number

    @ManyToOne(()=> User, (user)=>user.sells ,{
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    @Column({ nullable: false })
    userId: number;

    @ManyToMany(()=>Product, (product)=>product.sells, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    @JoinTable({name: "product_sell", joinColumn:{ name:"sell_id", referencedColumnName: 'id'},
         inverseJoinColumn:{ name: "product_id", referencedColumnName: 'id' }})
    products: Product[]

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updateAt:Date
}