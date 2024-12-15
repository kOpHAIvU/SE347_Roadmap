import { Progress } from "../../progress/entities/progress.entity";
import { Team } from "../../team/entities/team.entity";
import { Timeline } from "../../timeline/entities/timeline.entity";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class GroupDivision {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Team, team => team.groupDivision, { eager: true })
    team: Team;

    @ManyToOne(() => User, user => user.groupDivision, { eager: true })
    user: User;

    @ManyToOne(() => Timeline, timeline => timeline.groupDivision, { eager: true })
    timeline: Timeline;

    @Column({nullable: false})
    role: number;

    @Column({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP'})
    timeOfParticipant: Date;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;

}
