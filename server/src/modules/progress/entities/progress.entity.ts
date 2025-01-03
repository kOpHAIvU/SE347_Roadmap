import { Timeline } from "src/modules/timeline/entities/timeline.entity";
import { GroupDivision } from "../../group-division/entities/group-division.entity";
import { Node } from "../../node/entities/node.entity";
import { CreateDateColumn, PrimaryGeneratedColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Team } from "src/modules/team/entities/team.entity";

@Entity()
export class Progress {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Node, node => node.progress, { eager: true })
    node: Node;

    @ManyToOne(() => Timeline, timeline=> timeline.progress, { eager: true })
    timeline: Timeline;

    @ManyToOne(() => Team, team => team.progress, { eager: true })
    team: Team;

    @CreateDateColumn()  
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null;
}
