import { User } from 'src/modules/user/entities/user.entity';
import { Performance } from './../../performance/entities/performance.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Team } from 'src/modules/team/entities/team.entity';

@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, default: 0})
    performance: number;

    @ManyToOne(() => User, user => user.member)
    member: User;

    @ManyToOne(() => Team, team => team.team)
    team: Team;

    @Column({ type: 'boolean', default: true }) // Default status is 1 (true)
    isActive: boolean;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;
}
