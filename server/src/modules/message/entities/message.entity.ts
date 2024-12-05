import { Team } from "../../team/entities/team.entity";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    content: string;

    @Column({ type: 'boolean', default: false })
    check: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null; 

    @ManyToOne(() => User, sender => sender.messages, { eager: true })
    sender: User;

    @ManyToOne(() => Team, team => team.message, { eager: true })
    team: Team;
}
