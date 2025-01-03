import { GroupDivision } from "src/modules/group-division/entities/group-division.entity";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "../../message/entities/message.entity";
import { Progress } from "src/modules/progress/entities/progress.entity";

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column({default: "avatar.png"})
    avatar?: string;

    @ManyToOne(() => User, leader => leader.team, { eager: true })
    leader: User;   

    @Column({ type: 'boolean', default: true }) 
    isActive: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

    @OneToMany(() => GroupDivision, groupDivision => groupDivision.team)
    groupDivision: GroupDivision;

    @OneToMany(() => Message, message => message.sender)
    message: Message[];

    @OneToMany(() => Progress, progress => progress.team)
    progress: Progress[];
}
