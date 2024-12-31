import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: 0})
    totalPayment: number;

    @Column({default: "null"})
    code: string;

    // type be in ['zalopay', 'banking']
    @Column()
    type: string;

    @Column({default: "null"})
    oderurl: string;

    @ManyToOne(() => User, user => user.payment)
    user: User;

    @CreateDateColumn()  
    createdAt:Date

    @Column({default: false})
    status: boolean;

    @Column({default: "null"})
    image: string;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

    @Column({ type: 'boolean', default: true }) // Default status is 1 (true)
    isActive: boolean;
}
