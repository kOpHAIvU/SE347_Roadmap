import { User } from '../../user/entities/user.entity';
import { Performance } from './../../performance/entities/performance.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Team } from 'src/modules/team/entities/team.entity';
import { Timeline } from '../../timeline/entities/timeline.entity';
import { IsIn } from 'class-validator';

@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, default: 0})
    performance: number;

    @ManyToOne(() => User, user => user.member)
    member: User;

    @Column()
    @IsIn([1, 2, 3])  // 1 is OWNER, 2 is EDITOR, 3 is VIEWER 
    permission: number;

    @ManyToOne(() => Timeline, timeline => timeline.member)
    timeline: Timeline;

    @Column({ type: 'boolean', default: true }) // Default status is 1 (true)
    isActive: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;
}
