import { Roadmap } from "src/modules/roadmap/entities/roadmap.entity";
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

    @Column({nullable: false})
    type: string;

    @ManyToOne(() => User, reporter => reporter.report, { eager: true })
    reporter: User;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;


    @ManyToOne(() => User, receiver => receiver.receiverReport, {eager: true})
    receive: User;

    @ManyToOne(() => Roadmap,  roadmap => roadmap.report, {eager: true})
    roadmap: Roadmap;

    @Column({default: false})
    isChecked: boolean;
}
