import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    totalPayment: number;

    @Column({default: "null"})
    code: string;

    @ManyToOne(() => User, user => user.payment)
    user: User;

    @CreateDateColumn()  
    createdAt:Date

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

    @Column({ type: 'boolean', default: true }) // Default status is 1 (true)
    isActive: boolean;
}