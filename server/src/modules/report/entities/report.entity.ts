import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    title: string;

    @Column({nullable: false})
    content: string;

    @ManyToOne(() => User, reporter => reporter.report, { eager: true })
    reporter: User;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

    @Column({ type: 'boolean', default: true }) // Default status is 1 (true)
    isActive: boolean;

    @ManyToOne(() => User, receiver => receiver.receiverReport, {eager: true})
    receive: User

}
