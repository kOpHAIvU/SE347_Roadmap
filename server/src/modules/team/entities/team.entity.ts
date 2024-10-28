import { Member } from "src/modules/member/entities/member.entity";
import { Timeline } from "src/modules/timeline/entities/timeline.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column()
    avatar: string;

    // @ManyToOne(() => Timeline, timeline => timeline.team)
    // timeline: Timeline;

    @ManyToOne(() => User, leader => leader.team)
    leader: User;

    // @OneToMany(() => Member, member => member.team)
    // team: Member[]

    @Column({ type: 'boolean', default: true }) 
    isActive: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;
}
